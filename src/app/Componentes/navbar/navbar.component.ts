import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  usuario: any = null;

  constructor(private router: Router) {
    // Verificamos si el usuario ya está logueado
    const storedUser = localStorage.getItem('usuario');
    if (storedUser) {
      this.usuario = JSON.parse(storedUser);
    }
   }

  ngOnInit(): void {
  }
    // Método para cerrar sesión
    logout() {
      localStorage.removeItem('usuario');
      this.usuario = null;
      this.router.navigate(['']);
    }
    navegarInicio(){
      this.router.navigate(['/Main'])
    }
  }
  


