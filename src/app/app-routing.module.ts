import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './Componentes/login/login.component';
import { MainComponent } from './Componentes/main/main.component';
import { NavbarComponent } from './Componentes/navbar/navbar.component';
import { CatalogosComponent } from './Componentes/catalogos/catalogos.component';
import { AuthGuard } from './auth.guard';  // Importar el guard
import { ContactoComponent } from './Componentes/contacto/contacto.component';
import { PerfilUsuarioComponent } from './Componentes/perfil-usuario/perfil-usuario.component';
import { DetallerecursoComponent } from './Componentes/detallerecurso/detallerecurso.component';
import { SolicitudesComponent } from './Componentes/solicitudes/solicitudes.component';


const routes: Routes = [
  {path: '', component: LoginComponent},
  {path: "Main", component: MainComponent,canActivate: [AuthGuard], data: { roles: ['Alumno'] } },
  {path: "Navbar", component: NavbarComponent},
  {path: "Catalogos", component: CatalogosComponent},
  {path:"Contacto", component: ContactoComponent, canActivate: [AuthGuard], data: { roles: ['Alumno'] }},
  {path: "Perfil", component: PerfilUsuarioComponent},
  {path: "Detalle", component:DetallerecursoComponent},
  {path: "Solicitudes", component: SolicitudesComponent}
 
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
