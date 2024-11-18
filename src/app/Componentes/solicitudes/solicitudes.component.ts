import { Component, OnInit } from '@angular/core';
import { Usuario, Recurso, Solicitud } from 'src/app/Clases/bd';
import { Firestore, collection, collectionData, query, where } from '@angular/fire/firestore';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { deleteDoc, doc, setDoc, updateDoc, getDocs } from 'firebase/firestore';
import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-solicitudes',
  templateUrl: './solicitudes.component.html',
  styleUrls: ['./solicitudes.component.css']
})
export class SolicitudesComponent implements OnInit {
  
  solicitud: Solicitud[] = [];
  nuevaSolicitud = new Solicitud();
  listaSolicitudes: Solicitud[] = new Array();
  usuario = new Usuario();

  solisBD = collection(this.firestore, "Solicitudes")
  

  //usuario = new Usuario();


  
  constructor(private firestore: Firestore,
    private router : Router
  ) { }
  ngOnInit(): void {
   
    const usuarioId = localStorage.getItem('usuarioId');

    collectionData(this.solisBD, { idField: 'id' }).subscribe((data: any) => {
      this.listaSolicitudes = data;
    });
    if (usuarioId) {
      // Filtrar las solicitudes para el usuario autenticado
      const userSolicitudQuery = query(this.solisBD, where('usuarioId', '==', usuarioId));

      collectionData(userSolicitudQuery, { idField: 'id' }).subscribe((data: any) => {
        this.listaSolicitudes = data;
      });
    } else {
      // Si no se encuentra el ID del usuario, mostrar un mensaje de error o redirigir al inicio de sesión
      Swal.fire({
        title: 'Error',
        text: 'No se pudo obtener el ID del usuario. Por favor, inicie sesión nuevamente.',
        icon: 'error',
        confirmButtonText: 'OK'
      }).then(() => {
        this.router.navigate(['/Login']); // Redirige al login si no hay usuarioId
      });
    }
  }

 async  agregarSolicitud(form: NgForm) {

 

    if (form.valid) {
      const usuarioId = localStorage.getItem('usuarioId');

      if(usuarioId!== null){

        
       

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
  
  


   async abrirModalNuevaSolicitud(){
    const usuarioId = localStorage.getItem('usuarioId');
    const existingSolicitudRef = query(
      collection(this.firestore, 'Solicitudes'),
      where('usuarioId', '==', usuarioId),
      where('estado', 'in', ['Pendiente agregar recursos', 'Enviada', 'Aprobada'])
    );
   
    const existingSolicitudSnapshot = await getDocs(existingSolicitudRef);
    if (!existingSolicitudSnapshot.empty) {
      // El usuario ya tiene una solicitud activa, mostrar un mensaje de error
      Swal.fire({
        title: 'Recuerda',
        text: 'Ya tienes una solicitud activa. No puedes crear una nueva hasta que sea finalizada por el administrador.',
        icon: 'warning',
        confirmButtonText: 'OK',
        allowOutsideClick: false
      }).then((result) => {
        if (result.isConfirmed) {
          let btncerrar = document.getElementById("btnCerrarModalSolicitud")
          btncerrar?.click()
        }
      });
      return;
    }
    else{
      this.nuevaSolicitud = new Solicitud();
      
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

  }