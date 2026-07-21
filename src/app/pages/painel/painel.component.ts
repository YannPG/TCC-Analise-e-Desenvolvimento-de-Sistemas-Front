import { Component, OnInit } from '@angular/core';
import { AuthService } from '../login/services/auth.service';
import { UsuarioService } from 'src/app/core/services/usuario.service'; 

@Component({
  selector: 'app-painel',
  templateUrl: './painel.component.html',
  styleUrls: ['./painel.component.scss']
})
export class PainelComponent implements OnInit {
  
  nomeUsuario: string = 'Carregando...';
  iniciaisUsuario: string = '--';
  menuAberto: boolean = false; 

  constructor(
    private authService: AuthService,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit(): void {
    this.buscarDadosDoBackend();
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

  alternarMenu(): void {
    this.menuAberto = !this.menuAberto;
  }

  sair(): void {
    this.authService.deslogar();
  }
}