import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { AuthService } from '../../../pages/login/services/auth.service'; 
import { UsuarioService } from 'src/app/core/services/usuario.service'; 

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent implements OnInit {
  
  @Output() alternarMenuMobile = new EventEmitter<void>();

  nomeUsuario: string = 'Carregando...';
  iniciaisUsuario: string = '--';

  constructor(
      private authService: AuthService,
      private usuarioService: UsuarioService
  ) {}

  ngOnInit(): void {
    this.buscarDadosDoBackend();
  }

  alternarMenu(): void {
    this.alternarMenuMobile.emit();
  }

  sair(): void {
    this.authService.deslogar();
  }

  buscarDadosDoBackend(): void {
    this.usuarioService.obterPerfilAtual().subscribe({
      next: (perfilDTO) => {
        this.nomeUsuario = perfilDTO.nome;
        this.gerarIniciais();
      },
      error: (erro) => {
        console.error('Falha ao buscar dados do usuário:', erro);
        this.nomeUsuario = 'Usuário SIFEO';
        this.gerarIniciais();
      }
    });
  }

  gerarIniciais(): void {
    const nomes = this.nomeUsuario.trim().split(' ');
    if (nomes.length > 1) {
      this.iniciaisUsuario = (nomes[0][0] + nomes[nomes.length - 1][0]).toUpperCase();
    } else {
      this.iniciaisUsuario = this.nomeUsuario.substring(0, 2).toUpperCase();
    }
  }
}