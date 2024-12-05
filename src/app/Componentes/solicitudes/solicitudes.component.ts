import { Component, OnInit, NgZone } from '@angular/core';
import { Usuario, Recurso, Solicitud } from 'src/app/Clases/bd';
import { Firestore, Timestamp, collection, collectionData, query, where } from '@angular/fire/firestore';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { getDoc, doc, setDoc, updateDoc, getDocs } from 'firebase/firestore';
import { NgForm } from '@angular/forms';
import { CatalogosService } from '../catalogos/catalogos.service';



@Component({
  selector: 'app-solicitudes',
  templateUrl: './solicitudes.component.html',
  styleUrls: ['./solicitudes.component.css']
})
export class SolicitudesComponent implements OnInit {
  
  solicitud: Solicitud[] = [];
  nuevaSolicitud = new Solicitud();
  listaSolicitudes: Solicitud[] = new Array();
  estadosDisponibles: string[] = ['Aprobada', 'Finalizada', 'Rechazada'];
  usuario = new Usuario();

  solisBD = collection(this.firestore, "Solicitudes")
  
  esAdmin: boolean = false;

  //filtro por categoria
  estatusSeleccionado: string = '';
  solisFiltradas:  Solicitud[] = [];
  solicitudes: Solicitud[] = [];
  solicitudSeleccionada: any = null;





  
  constructor(private firestore: Firestore, private router: Router,   private ngZone: NgZone, private catalogoServ: CatalogosService ){
    const usuarioGuardado = localStorage.getItem('usuario');
    const usuarioId = localStorage.getItem('usuarioId');
  
    // Variable para determinar si el usuario es administrador
    const rolUsuario = usuarioGuardado ? JSON.parse(usuarioGuardado).Rol : null;
    const esAdmin = rolUsuario === 'Administrador';
    if (esAdmin) {
      collectionData(this.solisBD, { idField: 'id' }).subscribe((data: any) => {

          // Ordenar las solicitudes por fecha de inicio más cercana a la actual
      this.listaSolicitudes = data.sort((a: Solicitud, b: Solicitud) => {
        const fechaA = new Date(a.fechaInicio);
        const fechaB = new Date(b.fechaInicio);
        const hoy = new Date();
        
        // Calcular la diferencia absoluta entre la fecha de inicio y hoy
        const diferenciaA = Math.abs(fechaA.getTime() - hoy.getTime());
        const diferenciaB = Math.abs(fechaB.getTime() - hoy.getTime());
        
        return diferenciaA - diferenciaB;
      });


        this.listaSolicitudes = data; // Todas las solicitudes
        this.solicitudes = [...data]; // Asigna las solicitudes al array utilizado para el filtrado
        this.solisFiltradas = [...data]; // Inicializa las solicitudes filtradas
      });
    } else if (usuarioId) {
      const userSolicitudQuery = query(this.solisBD, where('usuarioId', '==', usuarioId));
      collectionData(userSolicitudQuery, { idField: 'id' }).subscribe((data: any) => {
        this.listaSolicitudes = data; // Solicitudes del usuario
        this.solicitudes = [...data];
        this.solisFiltradas = [...data];
      });
    }
    
     else {
      // Si no se encuentra el ID del usuario, redirigir al inicio de sesión
      Swal.fire({
        title: 'Error',
        text: 'No se pudo obtener el ID del usuario. Por favor, inicie sesión nuevamente.',
        icon: 'error',
        confirmButtonText: 'OK'
      }).then(() => {
        this.router.navigate(['/Login']); // Redirige al login si no hay usuarioId
      });
    }
  
    // Si hay un usuario guardado, cargar sus datos
    if (usuarioGuardado) {
      this.usuario.setData(JSON.parse(usuarioGuardado));
      this.nuevaSolicitud.nombreSolicitante = this.usuario.Nombre;
      this.nuevaSolicitud.matriculaSolic = this.usuario.Matricula;
    } else {
      Swal.fire("Error", "No se encontró información del usuario autenticado", "error");
    }
  }
  
  ngOnInit(): void {
    console.log('Solicitudes:', this.solicitudes);
    this.nuevaSolicitud.estado = 'Enviada';
    this.solisFiltradas = this.solicitudes; 
    if (!this.solicitudSeleccionada) {
      this.solicitudSeleccionada = { estado: 'Enviada' }; // Esto es para la solicitud seleccionada por defecto
    }
  }
 
  seleccionarSolicitud(solicitud: any) {
    this.solicitudSeleccionada = solicitud;
  }
  

 async  agregarSolicitud(form: NgForm) {

 

    if (form.valid) {
      const usuarioId = localStorage.getItem('usuarioId');

      if(usuarioId!== null){

        
        this.nuevaSolicitud.nombreSolicitante = this.usuario.Nombre;
        this.nuevaSolicitud.matriculaSolic = this.usuario.Matricula;
        this.nuevaSolicitud.carreraSolicitante = this.usuario.Carrera;

        this.nuevaSolicitud.usuarioId = usuarioId;
        this.nuevaSolicitud.estado = 'Pendiente agregar recursos';
        this.nuevaSolicitud.idSolicitud = this.generateRandomString(15);
        let rutaDoc = doc(this.firestore, "Solicitudes", this.nuevaSolicitud.idSolicitud);
        setDoc(rutaDoc, JSON.parse(JSON.stringify(this.nuevaSolicitud)))
          .then(() => {
            console.log('Formulario válido, agregando solicitud:', this.nuevaSolicitud);
  
            // Agregar la nueva solicitud a la lista local
            this.listaSolicitudes.push(this.nuevaSolicitud);
           
  
  
            // Mostrar el mensaje de SweetAlert
            Swal.fire({
              title: "Ir a catálogo",
              text: "Serás redirigido al catálogo para agregar tus recursos",
              icon: "question",
              showCancelButton: true,
              confirmButtonColor: "#3085d6",
              cancelButtonColor: "#d33",
              confirmButtonText: "Aceptar",
              cancelButtonText: "Cancelar"
            }).then((result) => {
              if (result.isConfirmed) {
                let btncerrar = document.getElementById("btnCerrarModalSolicitud");
                btncerrar?.click();
                this.router.navigate(['/Catalogos']); // Redirige al componente de Catálogos
                 // Cerrar el modal
           
              }
            });
          })
          .catch((error) => {
            console.error('Error al guardar la solicitud:', error);
          });
  
        // Resetea el formulario
        form.resetForm();
      }
      }
      else {
        // Mostrar un mensaje de error si no se encuentra el ID del usuario en el localStorage
        Swal.fire({
          title: 'Error',
          text: 'No se pudo obtener el ID del usuario',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    }
  

    async actualizarEstado(solicitudId: string, nuevoEstado: string) {
      try {
        // Buscar la solicitud
        const solicitudRef = doc(this.firestore, 'Solicitudes', solicitudId);
        const solicitudDoc = await getDoc(solicitudRef);
    
        if (solicitudDoc.exists()) {
          const solicitudData = solicitudDoc.data();
          const recursosSeleccionados = solicitudData?.recursos;
    
          // Si la solicitud está siendo aprobada, actualizamos las cantidades de los recursos
          if (nuevoEstado === 'Aprobada' && recursosSeleccionados) {
            for (let recurso of recursosSeleccionados) {
              // Obtener el recurso completo del catálogo utilizando el recursoId
              const recursoDoc = await getDoc(doc(this.firestore, 'Recursos', recurso.recursoId));
    
              if (recursoDoc.exists()) {
                const recursoData = recursoDoc.data();
                const cantidadSeleccionada = recurso.cantidadSeleccionada;
                const nuevaCantidadDisp = recursoData?.cantidadDisp - cantidadSeleccionada;
    
                // Usar el servicio CatalogosService para actualizar la cantidad disponible
                await this.catalogoServ.actualizarCantidadDisponible(recurso.recursoId, nuevaCantidadDisp);
              }
            }
          }
    
          // Si el estado cambia a "Finalizada", restablecer las cantidades
          if (nuevoEstado === 'Finalizada' && recursosSeleccionados) {
            for (let recurso of recursosSeleccionados) {
              // Obtener el recurso completo del catálogo utilizando el recursoId
              const recursoDoc = await getDoc(doc(this.firestore, 'Recursos', recurso.recursoId));
    
              if (recursoDoc.exists()) {
                const recursoData = recursoDoc.data();
                const cantidadSeleccionada = recurso.cantidadSeleccionada;
                const cantidadOriginal = recursoData?.cantidadDisp + cantidadSeleccionada;
    
                // Usar el servicio CatalogosService para restaurar la cantidad disponible
                await this.catalogoServ.actualizarCantidadDisponible(recurso.recursoId, cantidadOriginal);
              }
            }
          }
    
          // Actualizar el estado de la solicitud
          await updateDoc(solicitudRef, { estado: nuevoEstado });
    
          Swal.fire({
            title: 'Éxito',
            text: `La solicitud ha sido actualizada a ${nuevoEstado}.`,
            icon: 'success',
            confirmButtonText: 'Ok',
          });
        }
      } catch (error) {
        console.error('Error al actualizar el estado de la solicitud:', error);
        Swal.fire({
          title: 'Error',
          text: 'Hubo un problema al actualizar el estado de la solicitud',
          icon: 'error',
          confirmButtonText: 'Ok',
        });
      }
    }
    
    
  //funcion para el boton de nueva solicitud que solo ve el alumno
   async abrirModalNuevaSolicitud(){

    
   
    const usuarioId = localStorage.getItem('usuarioId');
    const existingSolicitudRef = query(
      collection(this.firestore, 'Solicitudes'),
      where('usuarioId', '==', usuarioId),
      where('estado', 'in', ['Pendiente agregar recursos', 'Enviada', 'Aprobada'])
      
    );
   
    const existingSolicitudSnapshot = await getDocs(existingSolicitudRef);
    
    
      this.nuevaSolicitud = new Solicitud();
      this.nuevaSolicitud.nombreSolicitante = this.usuario.Nombre;
      this.nuevaSolicitud.matriculaSolic = this.usuario.Matricula;
      this.nuevaSolicitud.carreraSolicitante = this.usuario.Carrera;

  
      
    

    
  }

  async aplicarFiltros() {
    // Si el filtro seleccionado es "Todas", mostrar todas las solicitudes sin filtrar por estado
    if (this.estatusSeleccionado === '') {
      this.solisFiltradas = this.solicitudes;
    } else {
      // Filtrar las solicitudes según el estado seleccionado
      this.solisFiltradas = this.solicitudes.filter(solicitud => solicitud.estado === this.estatusSeleccionado);
    }
  
    // Si no hay solicitudes que coincidan con el filtro, mostrar una alerta (excepto cuando se elige "Todas")
    if (this.solisFiltradas.length === 0 && this.estatusSeleccionado !== '') {
      await Swal.fire({
        title: 'No hay solicitudes',
        text: `No hay solicitudes con el estado '${this.estatusSeleccionado}'.`,
        icon: 'info',
        confirmButtonText: 'Aceptar'
      });
    }
  }
  
  


 
  //generar un ID aleatoria:
  generateRandomString = (num: number) => {
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let result1 = '';
      const charactersLength = characters.length;
      for (let i = 0; i < num; i++) {
          result1 += characters.charAt(Math.floor(Math.random() * charactersLength));
      }

      return result1;
  }

  validacionNumeros(event: KeyboardEvent): void 
  {
    const charCode = event.key.charCodeAt(0);
    if (!/[0-9]/.test(event.key))
      {
        event.preventDefault();
      }
  }

  validacionLetras(event: KeyboardEvent): void
  {
    const charCode = event.key.charCodeAt(0);
    if (!/[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/.test(event.key))
      {
        event.preventDefault();
      }
  }





  }