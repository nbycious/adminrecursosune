import { Component, OnInit } from '@angular/core';
//import { Firestore, collection, collectionData, query, where } from '@angular/fire/firestore';
import { Usuario } from 'src/app/Clases/bd';
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  credencial = new Usuario();
  constructor() { 
    this.credencial = history.state
  }

  
  ngOnInit(): void {
  }

}
