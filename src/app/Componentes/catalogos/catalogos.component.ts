import { Component, OnInit } from '@angular/core';
import { Usuario, Recurso, Solicitud} from 'src/app/Clases/bd';
import { Firestore, collection, collectionData, query, where } from '@angular/fire/firestore';
import { CatalogosService } from './catalogos.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { deleteDoc, doc, limit, setDoc, updateDoc } from 'firebase/firestore';
import { FileUploadService } from './upload.service';
import readXlsxFile from 'read-excel-file'
import { NgForm } from '@angular/forms';




@Component({
  selector: 'app-catalogos',
  templateUrl: './catalogos.component.html',
  styleUrls: ['./catalogos.component.css']
})
export class CatalogosComponent implements OnInit {


  recursos: any[] = [];
  solicitudActual= new Solicitud();
  usuario: any = null;

  nuevoRecurso = new Recurso();
  editRecurso = new Recurso();
  listaRecursos: Recurso[] = new Array();
  listaAlumnos: Usuario[] = new Array();

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
    console.log(this.usuario.Rol)
   this.catalogoServ.getRecursos().subscribe(recursos => {
    
    this.recursos = recursos;
    
    
    this.aplicarFiltros();
   })

   const solicitudesRef = collection(this.firestore, 'Solicitudes');
   let q = query(solicitudesRef, where( "estado", "==", "Pendiente agregar recursos"), limit(1))
   collectionData(q).subscribe((solicitudes: any[]) => {
     if (solicitudes.length > 0) {
       // Convertir el documento de Firebase a instancia de Solicitud
       let solicitud = new Solicitud();
       solicitud.setData(solicitudes[0])
       this.solicitudActual = solicitud; 
       console.log('Solicitud actual cargada:', this.solicitudActual);
     }
   });

  }

  async enviarSolicitud() {
    if (!this.solicitudActual || this.solicitudActual.recursos.length === 0) {
      Swal.fire({
        title: 'Error',
        text: 'No hay recursos en la solicitud o no hay una solicitud activa',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }
  
    try {
      // Obtener el ID del usuario del localStorage
      const usuarioId = localStorage.getItem('usuarioId');
  
      if (usuarioId !== null) {
        // Actualizar el estado de la solicitud
        const solicitudRef = doc(this.firestore, 'Solicitudes', this.solicitudActual.idSolicitud);
        await updateDoc(solicitudRef, { estado: 'Enviada', usuarioId: usuarioId });
  
        // Limpiar la variable solicitudActual
        this.solicitudActual = new Solicitud();
  
        // Mostrar mensaje de éxito
        Swal.fire({
          title: 'Solicitud enviada',
          text: 'Tu solicitud ha sido enviada exitosamente.',
          icon: 'success',
          confirmButtonText: 'OK'
        });
        this.router.navigate(['/Main']);
      } else {
        // Mostrar un mensaje de error si no se encuentra el ID del usuario en el localStorage
        Swal.fire({
          title: 'Error',
          text: 'No se pudo obtener el ID del usuario',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    } catch (error) {
      console.error('Error al enviar la solicitud:', error);
      Swal.fire({
        title: 'Error',
        text: 'Hubo un problema al enviar la solicitud.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  }

  onExcelUpload(event: any) {
    const file = event.target.files[0];
    if (file) {
      Swal.fire({
        title: '¿Estás seguro?',
        text: 'Esto subirá los datos desde el archivo Excel a Firestore.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, subir',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          readXlsxFile(file).then((rows: any[][]) => {
            const promises = rows.slice(1).map(row => {
              const recurso = new Recurso();
              recurso.fotoRecurso = row[1];
              recurso.nombreRecurso = row[2];       
              recurso.tipoRecurso = row[3]; 
              recurso.Estado = row[4]; 
              recurso.Categoria = row[5];
              recurso.Ubicacion = row[6];
              recurso.cantidadReal = row[7];
              recurso.cantidadDisp = row[8];
              
              this.listaRecursos.push(recurso);
              return this.agregarRecursoDesdeExcel(recurso);
            });
  
            // Espera a que todas las promesas se resuelvan antes de mostrar la alerta de éxito
            Promise.all(promises)
              .then(() => {
                Swal.fire('¡Subida exitosa!', 'Los recursos se han subido a Firestore.', 'success');
              })
              .catch(error => {
                Swal.fire('Error', 'Hubo un problema al subir los datos.', 'error');
                console.error('Error al subir recursos:', error);
              });
          });
        }
      });
    }
  }
  

  alumnoExcelUpload(event: any) {
    const file = event.target.files[0];
    if (file) {
      Swal.fire({
        title: '¿Estás seguro?',
        text: 'Esto subirá los datos desde el archivo Excel a Firestore.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, subir',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          readXlsxFile(file).then((rows: any[][]) => {
            const promises = rows.slice(1).map(row => {
              const usuario = new Usuario();
              usuario.Usuario = row[0];
              usuario.Nombre = row[1];       
              usuario.Rol = row[2]; 
              usuario.Contrasena = row[3];
              usuario.Carrera = row[4];
              usuario.Matricula = row[5];
  
              this.listaAlumnos.push(usuario);
              usuario.Usuario = String(row[0]); 
              usuario.Contrasena = String(usuario.Contrasena);
              usuario.Matricula = String(usuario.Matricula);
              return this.agregarAlumnoDesdeExcel(usuario);
            });
  
            // Espera a que todas las promesas se resuelvan antes de mostrar la alerta de éxito
            Promise.all(promises)
              .then(() => {
                Swal.fire('¡Subida exitosa!', 'Los alumnos se han subido a Firestore.', 'success');
              })
              .catch(error => {
                Swal.fire('Error', 'Hubo un problema al subir los datos.', 'error');
                console.error('Error al subir alumnos:', error);
              });
          });
        }
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

  // Método para agregar alumnos desde Excel a Firestore
  async agregarAlumnoDesdeExcel(usuario: Usuario) {
    try {
      const usuarioId = this.generateRandomString(15);
      usuario.UsuarioId = usuarioId;
      usuario.Usuario = String(usuario.Usuario);
      const rutaDoc = doc(this.firestore, "Usuarios", usuarioId);
      await setDoc(rutaDoc, JSON.parse(JSON.stringify(usuario)));
     
    } catch (error) {
      console.error('Error al agregar usuario desde Excel:', error);
    }
  }


  aplicarFiltros() {
    this.recursosFiltrados = this.recursos.filter(recurso => {
      // Filtro por término de búsqueda
      
      
      
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
  
  async agregarRecursoASolicitud(recurso: Recurso) {
    if (this.solicitudActual?.idSolicitud === "") {
      Swal.fire({
        title: 'Error',
        text: 'No hay una solicitud activa',
        icon: 'error',
        confirmButtonText: 'Ok',
      });
      return;
    }
  
    try {
      if (recurso.tipoRecurso === 'Aula') {
        recurso.cantidadSeleccionada = 1; // Asignar cantidad simbólica para aula
        this.solicitudActual!.recursos.push(recurso); // Se agrega el objeto completo
      } else {
        const result = await Swal.fire({
          title: '¿Agregar recurso?',
          text: `Selecciona la cantidad de "${recurso.nombreRecurso}" a agregar (disponible: ${recurso.cantidadDisp})`,
          icon: 'question',
          input: 'number',
          inputAttributes: {
            min: '1',
            max: recurso.cantidadDisp.toString(),
            step: '1',
          },
          inputLabel: 'Cantidad',
          showCancelButton: true,
          confirmButtonText: 'Sí, agregar',
          cancelButtonText: 'Cancelar',
          inputValidator: (value) => {
            if (!value || parseInt(value) <= 0 || parseInt(value) > recurso.cantidadDisp) {
              return `Introduce una cantidad válida entre 1 y ${recurso.cantidadDisp}`;
            }
            return null;
          },
        });
  
        if (result.isConfirmed) {
          const cantidad = parseInt(result.value || "0");
          recurso.cantidadSeleccionada = cantidad;
  
          // Solo agregar el recurso a la solicitud, sin modificar la cantidad disponible
          this.solicitudActual!.recursos.push(recurso);
        }
      }
  
      // Actualizar la solicitud en Firebase
      const solicitudRef = doc(this.firestore, 'Solicitudes', this.solicitudActual!.idSolicitud!);
      await updateDoc(solicitudRef, { recursos: this.solicitudActual!.recursos });
  
      Swal.fire({
        title: 'Éxito',
        text: `Se agregó el recurso correctamente a la solicitud.`,
        icon: 'success',
        confirmButtonText: 'Ok',
      });
    } catch (error) {
      console.error('Error al actualizar la solicitud:', error);
      Swal.fire({
        title: 'Error',
        text: 'Hubo un problema al agregar el recurso',
        icon: 'error',
        confirmButtonText: 'Ok',
      });
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

  validarNumeros(event: KeyboardEvent): void 
  {
    const charcode = event.key.charCodeAt(0);
    if (!/[0-9]/.test(event.key))
      {
        event.preventDefault();
      }
  }

  validarLetras(event: KeyboardEvent):void
  {
    const charcode = event.key.charCodeAt(0);
    if (!/[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/.test(event.key))
      {
        event.preventDefault();
      }
  }
  
}





 


  