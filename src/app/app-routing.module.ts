import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './Componentes/login/login.component';
import { MainComponent } from './Componentes/main/main.component';
import { NavbarComponent } from './Componentes/navbar/navbar.component';
import { CatalogosComponent } from './Componentes/catalogos/catalogos.component';
import { AuthGuard } from './auth.guard';  // Importar el guard


const routes: Routes = [
  {path: '', component: LoginComponent},
  {path: "Main", component: MainComponent,canActivate: [AuthGuard], data: { roles: ['Alumno'] } },
  {path: "Navbar", component: NavbarComponent},
  {path: "Catalogos", component: CatalogosComponent, canActivate: [AuthGuard], data: { roles: ['Administrador'] }}
 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
