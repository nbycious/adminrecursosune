import { Component, OnInit } from '@angular/core';
import { Usuario, Recurso } from 'src/app/Clases/bd';
import { Firestore, collection, collectionData, query, where } from '@angular/fire/firestore';
import { CatalogosService } from './catalogos.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { deleteDoc, doc, setDoc, updateDoc } from 'firebase/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgForm } from '@angular/forms';




@Component({
  selector: 'app-catalogos',
  templateUrl: './catalogos.component.html',
  styleUrls: ['./catalogos.component.css']
})
export class CatalogosComponent implements OnInit {


  recursos: Recurso[] = [];
  usuario: any = null;

  nuevoRecurso = new Recurso();
  editRecurso = new Recurso();
  listaRecursos: Recurso[] = new Array();

  // Nuevas propiedades para los filtros
  searchTerm: string = '';
  selectedCategory: string = '';
  selectedStatus: string = '';
  recursosFiltrados: Recurso[] = [];

  recursosBD= collection(this.firestore, "Recursos")
  esAula: boolean = false;
 
  constructor(private catalogoServ: CatalogosService, 
  private router: Router, 
  private firestore: Firestore, 
  ){

    
    
    const storedUser = localStorage.getItem('usuario');
    if (storedUser) {
      this.usuario = JSON.parse(storedUser);
    }

    let q = query(this.recursosBD)
    collectionData(q).subscribe((recursoSnap) =>{
      this.listaRecursos = new Array()
      recursoSnap.forEach((item) =>{
        let recu = new Recurso;
        recu.setData(item);
        this.listaRecursos.push(recu);
      })
    })
  }

  ngOnInit() {
   this.catalogoServ.getRecursos().subscribe(recursos => {
    this.recursos = recursos;
    this.aplicarFiltros();
   })
        

  }

  aplicarFiltros() {
    this.recursosFiltrados = this.recursos.filter(recurso => {
      // Filtro por término de búsqueda
      const cumpleBusqueda = !this.searchTerm || 
        recurso.nombreRecurso.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        recurso.descripcion.toLowerCase().includes(this.searchTerm.toLowerCase());

      // Filtro por categoría
      const cumpleCategoria = !this.selectedCategory ||
        (this.selectedCategory === 'Material' && 
         (recurso.tipoRecurso === 'Insumo' || recurso.tipoRecurso === 'Equipo')) ||
        (this.selectedCategory === 'Aula' && recurso.tipoRecurso === 'Aula');

      // Filtro por estado
      const cumpleEstado = !this.selectedStatus || 
        recurso.Estado === this.selectedStatus;

      // Retornar true solo si cumple con todos los filtros
      return cumpleBusqueda && cumpleCategoria && cumpleEstado;
    });
  }
  

  /*Funciones del modal*/
  abrirModalNuevoRecurso(){
    this.nuevoRecurso = new Recurso();
    
  }

  editarModalRecurso(recurso: Recurso){
    this.editRecurso = recurso
    this.esAula = this.editRecurso.tipoRecurso === 'Aula';
    
  }
  onEditTipoRecursoChange(tipo: string) {
    this.esAula = tipo === 'Aula';
  }

  agregarRecurso(form: NgForm) {
   
    if (form.valid){
      this.nuevoRecurso.recursoId = this.generateRandomString(15);
      let rutaDoc = doc(this.firestore, "Recursos", this.nuevoRecurso.recursoId);
      setDoc(rutaDoc, JSON.parse(JSON.stringify(this.nuevoRecurso))).then(() => {
        console.log('Formulario válido, agregando recurso:', this.nuevoRecurso);
        Swal.fire("Registro Exitoso");
        this.listaRecursos.push(this.nuevoRecurso);  // Actualiza la lista en tiempo real
        let btncerrar = document.getElementById("btnCerrarModalElemento");
        btncerrar?.click();
    });
    }
    else{
      console.log('Formulario no válido, revisa los campos.');
    form.control.markAllAsTouched(); // Marca todos los campos como tocados para mostrar los errores
    }
      
  
}
  
  editarRecurso(){
    let rutaDoc =  doc(this.firestore,"Recursos",this.editRecurso.recursoId);
    setDoc(rutaDoc,JSON.parse(JSON.stringify(this.editRecurso)))
    Swal.fire("Edición Exitosa")
    let btncerrar = document.getElementById("btnCerarEditElemento")
    btncerrar?.click()
  }

  

// Método que se ejecuta al cambiar el tipo de recurso
onTipoRecursoChange(tipo: string) {
  if (this.nuevoRecurso.tipoRecurso === 'Aula') {
    this.esAula = true;
  } else {
    this.esAula = false;
  }
}
  generateRandomString = (num: number) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result1 = '';
    const charactersLength = characters.length;
    for (let i = 0; i < num; i++) {
        result1 += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result1;
}

fotoPreview: string | ArrayBuffer | null = null;

  // Método para procesar la imagen seleccionada
  url="recurso.FotoRecurso"
  onImageSelected(event:any){
    if(event.target.files){
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload=(event:any)=>{
        this.url=event.target.result;
      }
    }
  }


  desactivarRecurso(recurso: Recurso) {
    const rutaDoc = doc(this.firestore, "Recursos", recurso.recursoId);
    
    Swal.fire({
      title: "¿Seguro que quiere desactivar?",
      text: "Se cambiará el estatus del recurso a 'Inactivo'",
      icon: "warning",
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Aceptar"
    }).then((result) => {
      if (result.isConfirmed) {
        // Actualizar el estado del recurso a "Inactivo"
        updateDoc(rutaDoc, {
          Estado: "Inactivo"
        }).then(() => {
          // Actualizar el estado en el objeto local
          recurso.Estado = "Inactivo";
          
          Swal.fire({
            title: "Estatus cambiado exitosamente",
            text: "El recurso ha sido desactivado",
            icon: "success"
          });
        }).catch((error) => {
          console.error("Error al desactivar el recurso:", error);
          Swal.fire({
            title: "Error",
            text: "No se pudo desactivar el recurso",
            icon: "error"
          });
        });
      }
    });
  }
}





 


  


