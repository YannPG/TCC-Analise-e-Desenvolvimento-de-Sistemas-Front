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

  exibirDialogPerfil: boolean = false;
  dadosUsuarioAtual: any = {};
  nomeUsuario: string = 'Carregando...';
  iniciaisUsuario: string = '--';
  toastMsg: string | null = null;
  toastTipo: 'sucesso' | 'erro' = 'sucesso';

  constructor(
      private authService: AuthService,
      private usuarioService: UsuarioService
  ) {}

  ngOnInit(): void {
    this.buscarDadosDoBackend();
  }

  mostrarToast(mensagem: string, tipo: 'sucesso' | 'erro' = 'sucesso'): void {
    this.toastMsg = mensagem;
    this.toastTipo = tipo;
    
    setTimeout(() => {
      this.toastMsg = null;
    }, 4000);
  }

  buscarDadosDoBackend(): void {
    this.usuarioService.obterPerfilAtual().subscribe({
      next: (perfilDTO) => {
        this.nomeUsuario = perfilDTO.nomeCompleto || perfilDTO.nomeUsuario || perfilDTO.nome || 'Usuário SIFEO'; 
        
        this.gerarIniciais();
        
        this.dadosUsuarioAtual = {
          id: perfilDTO.id,
          nomeCompleto: perfilDTO.nomeCompleto || perfilDTO.nome,
          nomeUsuario: perfilDTO.nomeUsuario,
          email: perfilDTO.email,
          cpf: perfilDTO.cpf,
          senha: '' 
        };
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
    this.alternarMenuMobile.emit();
  }

  sair(): void {
    this.authService.deslogar();
  }

  abrirDialogPerfil(): void {
    this.exibirDialogPerfil = true;
  }

  salvarEdicaoPerfil(dadosAtualizados: any): void {
    const alterouCredenciais = 
      this.dadosUsuarioAtual.email !== dadosAtualizados.email ||
      this.dadosUsuarioAtual.nomeUsuario !== dadosAtualizados.nomeUsuario ||
      (dadosAtualizados.senha && dadosAtualizados.senha.trim() !== '');

    this.usuarioService.atualizarPerfil(dadosAtualizados).subscribe({
      next: () => {
        this.exibirDialogPerfil = false;

        if (alterouCredenciais) {
          this.mostrarToast('Credenciais alteradas. Faça login novamente.', 'sucesso');
          setTimeout(() => {
            this.sair(); 
          }, 3000);
        } else {
          this.mostrarToast('Perfil atualizado com sucesso!', 'sucesso');
          this.buscarDadosDoBackend(); 
        }
      },
      error: (erro) => {
        console.error('Erro ao atualizar perfil', erro);
        this.mostrarToast('Erro ao atualizar os dados do perfil.', 'erro');
      }
    });
  }
}