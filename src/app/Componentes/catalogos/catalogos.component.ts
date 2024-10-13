import { Component, OnInit } from '@angular/core';
import { Usuario, Recurso } from 'src/app/Clases/bd';
import { Firestore, collection, collectionData, query, where } from '@angular/fire/firestore';
import { deleteDoc, doc, setDoc } from 'firebase/firestore';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-catalogos',
  templateUrl: './catalogos.component.html',
  styleUrls: ['./catalogos.component.css']
})
export class CatalogosComponent implements OnInit {

  recursos: Recurso[] = [];


  credencial = new Usuario();
  nuevoRecurso = new Recurso();
  editRecurso = new Recurso();
  listaRecursos: Recurso[] = new Array();

  recursosBD= collection(this.firestore, "Recursos")

  constructor(private firestore: Firestore, private navegacion: Router) {
    this.credencial = history.state;
    let q = query(this.recursosBD)
    collectionData(q).subscribe((recursoSnap) =>{
      this.listaRecursos = new Array()
      recursoSnap.forEach((item) =>{
        let recu = new Recurso;
        recu.setData(item);
        this.listaRecursos.push(recu);
      })
    })
  }

  ngOnInit() {
    
  }

  
  abrirModalNuevoRecurso(){
    this.nuevoRecurso = new Recurso();
    
  }

  editarModalRecurso(recurso: Recurso){
    this.editRecurso = recurso
    
  }

  agregarRecurso() {
    this.nuevoRecurso.recursoId = this.generateRandomString(15);
    let rutaDoc = doc(this.firestore, "Recursos", this.nuevoRecurso.recursoId);
    setDoc(rutaDoc, JSON.parse(JSON.stringify(this.nuevoRecurso))).then(() => {
      Swal.fire("Registro Exitoso");
      this.listaRecursos.push(this.nuevoRecurso);  // Actualiza la lista en tiempo real
      let btncerrar = document.getElementById("btnCerrarModalElemento");
      btncerrar?.click();
    });
  }
  
  editarRecurso(){
    let rutaDoc =  doc(this.firestore,"Recursos",this.editRecurso.recursoId);
    setDoc(rutaDoc,JSON.parse(JSON.stringify(this.editRecurso)))
    Swal.fire("Edicion Exitosa")
    let btncerrar = document.getElementById("btnCerarEditElemento")
    btncerrar?.click()
  }

  eliminarRecurso(recurso: Recurso){
    let rutaDoc =  doc(this.firestore,"Recursos",recurso.recursoId);
    deleteDoc(rutaDoc)
    Swal.fire("Se elimino el elemento")
  }


  generateRandomString = (num: number) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result1 = '';
    const charactersLength = characters.length;
    for (let i = 0; i < num; i++) {
        result1 += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result1;
}

  

}
