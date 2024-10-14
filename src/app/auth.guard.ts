import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(route: any): boolean {
    const storedUser = localStorage.getItem('usuario');
    if (storedUser) {
      const usuario = JSON.parse(storedUser);

      // Verificar si el usuario tiene acceso a la ruta
      if (route.data.roles && !route.data.roles.includes(usuario.Rol)) {
        // Si el rol no coincide, redirigir al login o a otra página
        this.router.navigate(['/login']);
        return false;
      }
      return true;
    } else {
      // Si no hay usuario logueado, redirigir al login
      this.router.navigate(['/login']);
      return false;
    }
  }
}
