import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './Componentes/login/login.component';
import { MainComponent } from './Componentes/main/main.component';
import { NavbarComponent } from './Componentes/navbar/navbar.component';
import { CatalogosComponent } from './Componentes/catalogos/catalogos.component';

import { PerfilUsuarioComponent } from './Componentes/perfil-usuario/perfil-usuario.component';

import { SolicitudesComponent } from './Componentes/solicitudes/solicitudes.component';



const routes: Routes = [
  {path: '', component: LoginComponent},
  {path: "Main", component: MainComponent},
  {path: "Navbar", component: NavbarComponent},
  {path: "Catalogos", component: CatalogosComponent},
  {path: "Perfil", component: PerfilUsuarioComponent},
  {path: "Solicitudes", component:SolicitudesComponent},

 
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
