import { Injectable } from "@angular/core";
import { Firestore, collectionData, collection, doc, docData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Recurso } from "src/app/Clases/bd";


@Injectable({
    providedIn: 'root'
  })
  export class CatalogosService{
    constructor(private firestore: Firestore){
       
    }
    getRecursos(): Observable<Recurso[]>{
        const recursosCollection = collection(this.firestore, 'Recursos');
        return collectionData(recursosCollection, { idField: 'idRecurso' }) as Observable<Recurso[]>;
    }
    getRecursoById(id: string): Observable<Recurso> {
        const recursoDoc = doc(this.firestore, `Recursos/${id}`);//$ (el pejecoin) construye una cadena de texto que representa la ruta del documento en firestore.
        return docData(recursoDoc, { idField: 'recursoId' }) as Observable<Recurso>;
      }
  }