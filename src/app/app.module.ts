import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './Componentes/login/login.component';
import { MainComponent } from './Componentes/main/main.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// Componentes
import { NavbarComponent } from './Componentes/navbar/navbar.component';
import { CatalogosComponent } from './Componentes/catalogos/catalogos.component';
import { ContactoComponent } from './Componentes/contacto/contacto.component';
import { PerfilUsuarioComponent } from './Componentes/perfil-usuario/perfil-usuario.component';
import { DetallerecursoComponent } from './Componentes/detallerecurso/detallerecurso.component';

// Firebase
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';

// Servicios
import { CatalogosService } from './Componentes/catalogos/catalogos.service';
import { FileUploadService } from './Componentes/catalogos/upload.service';
import { SolicitudesComponent } from './Componentes/solicitudes/solicitudes.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MainComponent,
    NavbarComponent,
    CatalogosComponent,
    ContactoComponent,
    PerfilUsuarioComponent,
    DetallerecursoComponent,
    SolicitudesComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage())
  ],
  providers: [
    CatalogosService,
    FileUploadService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }