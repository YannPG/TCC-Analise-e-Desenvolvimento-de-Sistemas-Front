import { Component, OnInit } from '@angular/core';
import { PropriedadesService, Propriedade } from 'src/app/core/services/propriedades.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-propriedades',
  templateUrl: './propriedades.component.html',
  styleUrls: ['./propriedades.component.scss']
  
})
export class PropriedadesComponent implements OnInit {

  exibirDialogDetalhes: boolean = false;
  propriedadeSelecionada!: Propriedade;
  exibirDialogRegistro: boolean = false;
  propriedades: Propriedade[] = [];
  termoBusca: string = '';
  exibirDialogExclusao: boolean = false;
  propriedadeParaExcluir: any = null;

  constructor(private propriedadesService: PropriedadesService, private snackBar: MatSnackBar) {}

  private mostrarMensagem(mensagem: string, tipo: 'sucesso' | 'erro'): void {
    this.snackBar.open(mensagem, 'Fechar', {
      duration: 4000, 
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: tipo === 'sucesso' ? ['snackbar-sucesso'] : ['snackbar-erro']
    });
  }

  ngOnInit(): void {
    this.carregarDadosReais();
  }

  carregarDadosReais(): void {
    this.propriedadesService.listarPropriedades().subscribe({
      next: (dadosDoBackend) => {
        this.propriedades = dadosDoBackend;
      },
      error: (erro) => {
        console.error('Falha ao buscar propriedades do SIFEO', erro);
      }
    });
  }

  registrarPropriedade(): void {
    this.exibirDialogRegistro = true;
  } 

  salvarNovaPropriedade(dadosFormulario: any): void {
    this.propriedadesService.criarPropriedade(dadosFormulario).subscribe({
      next: () => {
        this.exibirDialogRegistro = false; 
        this.carregarDadosReais(); 
        this.mostrarMensagem('Propriedade registrada com sucesso!', 'sucesso');
      },
      error: (erro) => {
        console.error('Falha ao registrar a propriedade', erro);
        
        const mensagemServidor = erro.error?.message || 'Erro de validação ao salvar os dados no servidor.';
        
        this.mostrarMensagem(`Atenção: ${mensagemServidor}`, 'erro');
      }
    });
  }

  verDetalhes(prop: Propriedade): void {
    this.propriedadeSelecionada = prop;
    this.exibirDialogDetalhes = true;
  }

  salvarEdicaoPropriedade(dadosAtualizados: any): void {
    const id = dadosAtualizados.id;
    
    this.propriedadesService.atualizarPropriedade(id, dadosAtualizados).subscribe({
      next: () => {
        this.exibirDialogDetalhes = false;
        this.carregarDadosReais(); 
      },
      error: (erro) => {
        console.error('Falha ao atualizar', erro);
        alert('Erro ao salvar as alterações.');
      }
    });
  }

  deletarPropriedade(id: number, nome: string): void {
    const confirmacao = window.confirm(`ATENÇÃO: Tem certeza que deseja excluir a propriedade "${nome}"?\n\nEsta ação é irreversível e pode falhar se houver dados vinculados a ela.`);
    
    if (confirmacao) {
      this.propriedadesService.deletar(id).subscribe({
        next: () => {
          alert('Propriedade excluída com sucesso!');
          this.carregarDadosReais();
        },
        error: (err) => {
          console.error(err);
          alert('Erro ao excluir a propriedade. Verifique se existem setores vinculados a ela ou tente novamente.');
        }
      });
    }
  }

  iniciarExclusao(prop: any): void {
    this.propriedadeParaExcluir = prop;
    this.exibirDialogExclusao = true;
  }

  executarExclusao(): void {
    if (!this.propriedadeParaExcluir) return;

    this.propriedadesService.deletar(this.propriedadeParaExcluir.id).subscribe({
      next: () => {
        this.mostrarMensagem('Propriedade excluída com sucesso!', 'sucesso');
        this.exibirDialogExclusao = false;
        this.propriedadeParaExcluir = null;
        this.carregarDadosReais();
      },
      error: (err) => {
        console.error(err);
        const mensagemServidor = err.error?.message || 'Erro ao excluir a propriedade.';
        this.mostrarMensagem(`Erro: ${mensagemServidor}`, 'erro');
        this.exibirDialogExclusao = false;
      }
    });
  }
}