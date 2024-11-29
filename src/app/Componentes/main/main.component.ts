import { Component, OnInit } from '@angular/core';
//import { Firestore, collection, collectionData, query, where } from '@angular/fire/firestore';
import { Usuario } from 'src/app/Clases/bd';
import { Router } from '@angular/router';
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  credencial = new Usuario();
  usuario= new Usuario();
  rol: string | null = null;

  constructor(private router: Router) {   
    this.credencial = history.state
    
  }

  navegaraCatalogos(){
    this.router.navigate(['/Catalogos'])
  }
 
  ngOnInit(): void {
    this.rol = localStorage.getItem('rol');
  console.log('Rol del usuario:', this.rol);
    

  }
  logout(): void {
    // Limpiar el localStorage
    localStorage.removeItem('usuario'); // Elimina los datos del usuario
    localStorage.removeItem('rol'); // Elimina el rol, si está almacenado por separado
    localStorage.clear(); // Alternativamente, limpia todo el localStorage si no necesitas otras claves
  
    // Redirigir al login
    this.router.navigate(['/login']);
  }
}
