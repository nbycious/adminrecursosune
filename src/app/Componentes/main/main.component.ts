import { Component, OnInit } from '@angular/core';
//import { Firestore, collection, collectionData, query, where } from '@angular/fire/firestore';
import { Usuario } from 'src/app/Clases/bd';
import { Router } from '@angular/router';
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  credencial = new Usuario();
  constructor(private router: Router) { 
    this.credencial = history.state
  }

  navegaraCatalogos(){
    this.router.navigate(['/Catalogos'])
  }
  navegaraContacto(){
    this.router.navigate(['/Contacto'])
  }
  ngOnInit(): void {
  }

}
