import { Injectable } from '@angular/core';
import { Firestore, collectionData, collection, doc, docData, query, where } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Solicitud } from '../Clases/bd';

@Injectable({
  providedIn: 'root'
})
export class SolicitudesService {

  constructor(private firestore: Firestore) { 

  }
  getSolicitudes(): Observable<Solicitud[]>{
    const solicitudesCollection = collection(this.firestore,"Solicitudes");
    return collectionData(solicitudesCollection, {idField: "idSolicitud"}) as Observable<Solicitud[]>
  }
  getSolicitud(id: string): Observable<Solicitud> {
    const solicitudDoc = doc(this.firestore, `Solicitudes/${id}`);//$ (el pejecoin) construye una cadena de texto que representa la ruta del documento en firestore.
    return docData(solicitudDoc, { idField: 'idSolicitud' }) as Observable<Solicitud>;
  }
  getSolicitudActivaPorMatricula(matricula: string): Observable<Solicitud[]> {
    const solicitudesCollection = collection(this.firestore, "Solicitudes");
    const solicitudActivaQuery = query(
      solicitudesCollection,
      where("matriculaSolic", "==", matricula),
      where("estadoSolicitud", "in", ["Pendiente", "Aprobada"]) // Filtra las solicitudes activas
    );
    return collectionData(solicitudActivaQuery, { idField: "idSolicitud" }) as Observable<Solicitud[]>;
  }
}
