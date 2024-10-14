import { Component, OnInit } from '@angular/core';
import { Firestore, collection, collectionData, query, where } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/Clases/bd';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  usuario = "";
  contrasena = "";
  credencial = new Usuario();

  //Firebase
  UsuariosColeccion = collection(this.firestore, "Usuarios");

  constructor(private firestore: Firestore, private navegacion: Router) { }

  ngOnInit(): void {
  }

  logIn() {
    // Validación de credenciales
    let q = query(this.UsuariosColeccion, where("Usuario", "==", this.usuario), where("Contrasena", "==", this.contrasena));
    
    collectionData(q).subscribe((usuarioSnap) => {
      if (usuarioSnap.length != 0) {
        Swal.fire("Acceso exitoso");
  
        // Llenar variable con la información del usuario
        this.credencial.setData(usuarioSnap[0]);
  
        // Guardar el usuario en localStorage
        localStorage.setItem('usuario', JSON.stringify(this.credencial));
  
        // Redirigir según el rol del usuario
        if (this.credencial.Rol === 'Administrador') {
          this.navegacion.navigate(['Catalogos']);
        } else if (this.credencial.Rol === 'Alumno') {
          this.navegacion.navigate(['Main']);
        }
  
      } else {
        Swal.fire("No se encontraron usuarios con esas credenciales");
      }
    });
  }
  
}
