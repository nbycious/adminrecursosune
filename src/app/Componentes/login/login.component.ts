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

  logIn(){

    //validacion de que los datos del login sean los mismos que estan en la base de datos
   let q = query(this.UsuariosColeccion, where("Usuario", "==", this.usuario), where("Contrasena", "==", this.contrasena) )


    collectionData(q).subscribe((usuarioSnap) => {
      if(usuarioSnap.length !=0){
        Swal.fire("Acceso exitoso")
        //Llenar variable con informacion del usuario en firebase
        this.credencial.setData(usuarioSnap[0])
        //this.navegacion.navigate(['Main'],{state: {nom: usuarioSnap[0].Nombre!}}) // state busca en la coleccion de datos el campo nombre  //navigate es un metodo parar redireccionar
        this.navegacion.navigate(['Catalogos'], {state: this.credencial })
      }
      else{
        Swal.fire("No se encontraron usuarios con esas credenciales")
      }
    })


  }

}
