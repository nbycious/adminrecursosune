import { Component, OnInit } from '@angular/core';
import { Usuario, Recurso, Solicitud } from 'src/app/Clases/bd';
import { Firestore, collection, collectionData, query, where } from '@angular/fire/firestore';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { deleteDoc, doc, setDoc, updateDoc } from 'firebase/firestore';
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

  solisBD = collection(this.firestore, "Solicitudes")
  
  constructor(private firestore: Firestore,
    private router : Router
  ) { }
  ngOnInit(): void {
    collectionData(this.solisBD, { idField: 'id' }).subscribe((data: any) => {
      this.listaSolicitudes = data;
    });
  }


  agregarSolicitud(form: NgForm) {
    if (form.valid) {
      this.nuevaSolicitud.estado = 'Pendiente';
      this.nuevaSolicitud.idSolicitud = this.generateRandomString(15);
      let rutaDoc = doc(this.firestore, "Solicitudes", this.nuevaSolicitud.idSolicitud);
      setDoc(rutaDoc, JSON.parse(JSON.stringify(this.nuevaSolicitud)))
        .then(() => {
          console.log('Formulario válido, agregando solicitud:', this.nuevaSolicitud);

          // Agregar la nueva solicitud a la lista local
          this.listaSolicitudes.push(this.nuevaSolicitud);

          // Cerrar el modal
          let btncerrar = document.getElementById("btnCerrarModalElemento");
          btncerrar?.click();

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
              this.router.navigate(['/Catalogos']); // Redirige al componente de Catálogos
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


  abrirModalNuevaSolicitud(){
    this.nuevaSolicitud = new Solicitud();
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