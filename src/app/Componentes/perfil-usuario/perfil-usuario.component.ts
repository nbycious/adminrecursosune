import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/Clases/bd';
import { PerfilUsuarioService } from './perfil-usuario.service';

@Component({
  selector: 'app-perfil-usuario',
  templateUrl: './perfil-usuario.component.html',
  styleUrls: ['./perfil-usuario.component.css']
})
export class PerfilUsuarioComponent implements OnInit {
  usuarios: Usuario[] = [];
  constructor(private usuarioService: PerfilUsuarioService) { }

  ngOnInit() {
    this.usuarioService.getUsuarios().subscribe(usuarios =>{
      this.usuarios = usuarios;
    });
  }

}
