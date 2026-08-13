import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AtividadeService, AtividadeRequest } from 'src/app/core/services/atividade.service';
import { ContextoService } from 'src/app/core/services/contexto.service';

@Component({
  selector: 'app-registrar-atividade-dialog',
  templateUrl: './registrar-atividade-dialog.component.html',
  styleUrls: ['./registrar-atividade-dialog.component.scss']
})
export class RegistrarAtividadeDialogComponent implements OnInit {

  @Input() atividadeParaEditar: any = null;
  @Output() fechar = new EventEmitter<void>();
  @Output() salvo = new EventEmitter<void>();

  isEdicao: boolean = false;
  carregando: boolean = false;
  erroValidacao: string | null = null;

  setores: any[] = [];
  tiposAtividade: any[] = [];
  funcionarios: any[] = [];
  equipamentos: any[] = [];

  dadosAtividade: any = {
    setorId: null,
    tipoAtividadeId: null,
    responsavelId: null,
    equipamentosIds: [],
    dataAtividade: '',
    status: 'AGENDADA',
    descricao: ''
  };

  constructor(
    private atividadeService: AtividadeService,
    private contextoService: ContextoService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.carregarFiltros();

    if (this.atividadeParaEditar) {
      this.isEdicao = true;
      this.dadosAtividade = {
        setorId: this.atividadeParaEditar.setorId, 
        tipoAtividadeId: this.atividadeParaEditar.tipoAtividadeId,
        responsavelId: this.atividadeParaEditar.responsavelId,
        equipamentosIds: this.atividadeParaEditar.equipamentosIds || [],
        dataAtividade: this.atividadeParaEditar.dataAtividade,
        status: this.atividadeParaEditar.status,
        descricao: this.atividadeParaEditar.descricao
      };
    }
  }

  carregarFiltros(): void {
    const idSitioAtual = this.contextoService.getPropriedadeAtual();

    if (!idSitioAtual) {
      console.warn('Alerta Arquitetural: Nenhuma propriedade está selecionada na Topbar.');
      return; 
    }

    const urlSetores = environment.apiUrl.endsWith('/api') 
      ? `${environment.apiUrl}/setores` 
      : `${environment.apiUrl}/api/setores`;

    this.http.get<any[]>(urlSetores, {
      params: { sitioId: idSitioAtual.toString() }
    }).subscribe({
      next: (res) => this.setores = res,
      error: (err) => console.error('Erro na rota de Setores:', err)
    });
    
    this.http.get<any[]>(environment.apiTiposAtividade).subscribe({
      next: (res) => this.tiposAtividade = res,
      error: (err) => console.error('Erro na rota de Tipos de Atividade:', err)
    });
    
    this.http.get<any[]>(environment.apiFuncionarios).subscribe({
      next: (res) => this.funcionarios = res,
      error: (err) => console.error('Erro na rota de Funcionários:', err)
    });
    
    this.http.get<any[]>(environment.apiEquipamentos, {
      params: { sitioId: idSitioAtual.toString() }
    }).subscribe({
      next: (res) => this.equipamentos = res,
      error: (err) => console.error('Erro na rota de Equipamentos:', err)
    });
  }

  cancelar(): void {
    this.fechar.emit();
  }

  confirmar(): void {
    this.erroValidacao = null;

    if (!this.dadosAtividade.setorId || !this.dadosAtividade.tipoAtividadeId || 
        !this.dadosAtividade.responsavelId || !this.dadosAtividade.dataAtividade || 
        !this.dadosAtividade.descricao) {
      this.erroValidacao = 'Preencha todos os campos obrigatórios (*).';
      return;
    }

    const payload: AtividadeRequest = {
      setorId: Number(this.dadosAtividade.setorId),
      tipoAtividadeId: Number(this.dadosAtividade.tipoAtividadeId),
      responsavelId: Number(this.dadosAtividade.responsavelId),
      equipamentosIds: this.dadosAtividade.equipamentosIds.map(Number),
      dataAtividade: this.dadosAtividade.dataAtividade,
      status: this.dadosAtividade.status,
      descricao: this.dadosAtividade.descricao
    };

    this.carregando = true;

    if (this.isEdicao) {
      this.atividadeService.atualizar(this.atividadeParaEditar.id, payload).subscribe({
        next: () => this.concluirSalvamento(),
        error: (err) => this.tratarErro(err)
      });
    } else {
      this.atividadeService.cadastrar(payload).subscribe({
        next: () => this.concluirSalvamento(),
        error: (err) => this.tratarErro(err)
      });
    }
  }

  private concluirSalvamento(): void {
    this.carregando = false;
    this.salvo.emit();
    this.fechar.emit();
  }

  private tratarErro(erro: any): void {
    this.carregando = false;
    console.error(erro);
    this.erroValidacao = 'Erro ao processar a requisição. Verifique os dados.';
  }
}