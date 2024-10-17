import { Injectable } from '@angular/core';//injectable define el servicio
import { Firestore, collectionData, collection, doc, docData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';  // importa Observable para manejar flujos de datos reactivo
import { Usuario } from 'src/app/Clases/bd';

@Injectable({
    providedIn: 'root'
  })
  export class PerfilUsuarioService {
    constructor(private firestore: Firestore){}

    getUsuarios(): Observable<Usuario[]> { //recibe un id de tipo de string 
        const usuariosCollection = collection(this.firestore, 'CDs');
        return collectionData(usuariosCollection, { idField: 'UsuarioId' }) as Observable<Usuario[]>; //clase de ReactiveX parae trabajar con cambios instantaneos en la base
      }
    
      getUsuarioById(id: string): Observable<Usuario> {
        const userDoc = doc(this.firestore, `CDs/${id}`);//$ (el pejecoin) construye una cadena de texto que representa la ruta del documento en firestore.
        return docData(userDoc, { idField: 'UsuarioId' }) as Observable<Usuario>;
      }
      
  }