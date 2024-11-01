import { Component, OnInit } from '@angular/core';
import { Usuario, Recurso } from 'src/app/Clases/bd';
import { Firestore, collection, collectionData, query, where } from '@angular/fire/firestore';
import { CatalogosService } from './catalogos.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { deleteDoc, doc, setDoc, updateDoc } from 'firebase/firestore';
import { FileUploadService } from './upload.service';
import readXlsxFile from 'read-excel-file'
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
  tipoSeleccionado: string = "";
  categoriaSeleccionada: string = '';
  estadoSeleccionado: string = '';
  recursosFiltrados: Recurso[] = [];
  public archivos: any = [];
  recursosBD= collection(this.firestore, "Recursos")
  esAula: boolean = false;
 
  selectedFile: File | null = null;

  
  constructor(private catalogoServ: CatalogosService, 
  private router: Router, 
  private firestore: Firestore, 
  private fileUploadService: FileUploadService
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


  onExcelUpload(event: any) {
    const file = event.target.files[0];
    if (file) {
      readXlsxFile(file).then((rows: any[][]) => {
        rows.slice(1).forEach(row => {
          const recurso = new Recurso();
          recurso.fotoRecurso = row[1];
          recurso.nombreRecurso = row[2];       
          recurso.tipoRecurso = row[4]; 
          recurso.Estado = row[5]; 
          recurso.Categoria = row[6];
          recurso.Ubicacion = row[7];
          recurso.cantidadReal = row[10];
          

          // Guarda el recurso en Firestore
          this.agregarRecursoDesdeExcel(recurso);
          this.listaRecursos.push(recurso);     
        });
      });
    }
  }


  // Método para agregar recursos desde Excel a Firestore
  async agregarRecursoDesdeExcel(recurso: Recurso) {
    try {
      const recursoId = this.generateRandomString(15);
      recurso.recursoId = recursoId;
      const rutaDoc = doc(this.firestore, "Recursos", recursoId);
      await setDoc(rutaDoc, JSON.parse(JSON.stringify(recurso)));
     
    } catch (error) {
      console.error('Error al agregar recurso desde Excel:', error);
    }
  }
  aplicarFiltros() {
    this.recursosFiltrados = this.recursos.filter(recurso => {
      // Filtro por término de búsqueda
      
      console.log("RecursoNombre",recurso.nombreRecurso);
      
      const cumpleBusqueda = !this.searchTerm || 
        recurso.nombreRecurso.toLowerCase().includes(this.searchTerm.toLowerCase())
      
      // Filtro por tipo
      const cumpleTipo = !this.tipoSeleccionado ||
        (this.categoriaSeleccionada=== 'Material' && 
         (recurso.tipoRecurso === 'Insumo' || recurso.tipoRecurso === 'Equipo')) ||
        (this.tipoSeleccionado=== 'Aula' && recurso.tipoRecurso === 'Aula');

      // Filtro por estado
      const cumpleEstado = !this.estadoSeleccionado || 
        recurso.Estado === this.estadoSeleccionado;
    //filtro por categoria
      const cumpleCategoria =!this.categoriaSeleccionada ||
      recurso.Categoria === this.categoriaSeleccionada;
      // Retornar true solo si cumple con todos los filtros
      return cumpleBusqueda && cumpleTipo && cumpleEstado && cumpleCategoria;
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

  async agregarRecurso(form: NgForm) {
   
    if (form.valid){
      try {
        if (this.selectedFile) {
          // Subir la imagen y obtener la URL
          const imageUrl = await this.fileUploadService.uploadImage(
            this.selectedFile,
            'recursos' // carpeta en Firebase Storage
          );
          
          // Asignar la URL a la propiedad fotoRecurso
          this.nuevoRecurso.fotoRecurso = imageUrl;
        }
  
           this.nuevoRecurso.recursoId = this.generateRandomString(15);
            let rutaDoc = doc(this.firestore, "Recursos", this.nuevoRecurso.recursoId);
            setDoc(rutaDoc, JSON.parse(JSON.stringify(this.nuevoRecurso)))
              console.log('Formulario válido, agregando recurso:', this.nuevoRecurso);
              Swal.fire("Registro Exitoso");
              this.listaRecursos.push(this.nuevoRecurso);  // Actualiza la lista en tiempo real
              let btncerrar = document.getElementById("btnCerrarModalElemento");
              btncerrar?.click();
         
  
        
      } catch (error) {
        console.error('Error al guardar el recurso:', error);
      }
 
    }
    else{
      console.log('Formulario no válido, revisa los campos.');
    form.control.markAllAsTouched(); // Marca todos los campos como tocados para mostrar los errores
    }
      

}
  
 async editarRecurso(form: NgForm){
  if (form.valid){
    try {
      if (this.selectedFile) {
        // Subir la imagen y obtener la URL
        const imageUrl = await this.fileUploadService.uploadImage(
          this.selectedFile,
          'recursos' // carpeta en Firebase Storage
        );
        
        // Asignar la URL a la propiedad fotoRecurso
        this.editRecurso.fotoRecurso = imageUrl;
      }
      let rutaDoc =  doc(this.firestore,"Recursos",this.editRecurso.recursoId);
      setDoc(rutaDoc,JSON.parse(JSON.stringify(this.editRecurso)))
      Swal.fire("Edición Exitosa")
      let btncerrar = document.getElementById("btnCerrarEditElemento")
      btncerrar?.click()
     
      
    } catch (error) {
      console.error('Error al guardar el recurso:', error);
    }
   
  }
  else{
    console.log('Formulario no válido, revisa los campos.');
  form.control.markAllAsTouched(); // Marca todos los campos como tocados para mostrar los errores
  }
}



 
// Método que se ejecuta al cambiar el tipo de recurso
onTipoRecursoChange(tipo: string) {
  if (this.nuevoRecurso.Categoria === 'AULA') {
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

  async onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  activarRecurso(recurso: Recurso){
    const rutaDoc = doc(this.firestore, "Recursos", recurso.recursoId);
    Swal.fire({
      title: "¿Seguro que quiere reactivar?",
      text: "Se cambiará el estatus del recurso a 'Activo'",
      icon: "warning",
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Aceptar"
    }).then((result)=>{

      if (result.isConfirmed) {
        // Actualizar el estado del recurso a "Inactivo"
        updateDoc(rutaDoc, {
          Estado: "Activo"
        }).then(() => {
          // Actualizar el estado en el objeto local
          recurso.Estado = "Activo";
          
          Swal.fire({
            title: "Estatus cambiado exitosamente",
            text: "El recurso ha sido activado",
            icon: "success"
          });
        }).catch((error) => {
          console.error("Error al activar el recurso:", error);
          Swal.fire({
            title: "Error",
            text: "No se pudo activar el recurso",
            icon: "error"
          });
        });
      }
    });
  
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





 


  