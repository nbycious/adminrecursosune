import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './Componentes/login/login.component';
import { MainComponent } from './Componentes/main/main.component';
import { FormsModule } from '@angular/forms';
//BD
import {provideFirebaseApp, initializeApp} from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { NavbarComponent } from './Componentes/navbar/navbar.component';


import { CatalogosComponent } from './Componentes/catalogos/catalogos.component';
import { ContactoComponent } from './Componentes/contacto/contacto.component';
import { CatalogosService } from './Componentes/catalogos/catalogos.service';
import { PerfilUsuarioComponent } from './Componentes/perfil-usuario/perfil-usuario.component';
import { DetallerecursoComponent } from './Componentes/detallerecurso/detallerecurso.component';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MainComponent,
    NavbarComponent,
    CatalogosComponent,
    ContactoComponent,
    PerfilUsuarioComponent,
    DetallerecursoComponent
    
    
  
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideFirestore(() => getFirestore())

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
