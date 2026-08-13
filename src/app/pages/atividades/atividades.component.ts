import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ContextoService } from '../../core/services/contexto.service';
import { AtividadeService } from '../../core/services/atividade.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-atividades',
  templateUrl: './atividades.component.html',
  styleUrls: ['./atividades.component.scss']
})
export class AtividadesComponent implements OnInit, OnDestroy {

  carregando: boolean = false;
  mostrarModal: boolean = false;
  atividadeSelecionada: any = null;
  idAtividadeExcluir: number | null = null;

  termoBusca: string = '';
  filtroTipo: string = 'ALL';
  filtroSetor: string | number = 'ALL';

  idSitioAtual: number | null = null;
  private contextoSub!: Subscription;

  listaSetores: any[] = [];
  atividadesOriginais: any[] = [];
  atividades: any[] = [];

  constructor(
    private contextoService: ContextoService,
    private atividadeService: AtividadeService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.contextoSub = this.contextoService.propriedadeAtual$.subscribe(id => {
      this.idSitioAtual = id;
      this.carregarSetoresDoFiltro();
      this.carregarAtividades();
    });
  }

  ngOnDestroy(): void {
    if (this.contextoSub) {
      this.contextoSub.unsubscribe();
    }
  }

  carregarSetoresDoFiltro(): void {
    if (!this.idSitioAtual) return;

    const urlSetores = environment.apiUrl.endsWith('/api') 
      ? `${environment.apiUrl}/setores` 
      : `${environment.apiUrl}/api/setores`;

    this.http.get<any[]>(urlSetores, {
      params: { sitioId: this.idSitioAtual.toString() }
    }).subscribe({
      next: (res) => this.listaSetores = res,
      error: (err) => console.error('Erro ao carregar lista de setores para o filtro:', err)
    });
  }

  carregarAtividades(): void {
    this.carregando = true;

    this.atividadeService.listarTodos(this.idSitioAtual || undefined).subscribe({
      next: (dados) => {
        this.atividadesOriginais = dados;
        this.aplicarFiltros(); 
        this.carregando = false;
      },
      error: (erro) => {
        console.error('Erro ao carregar atividades', erro);
        this.carregando = false;
      }
    });
  }

  aplicarFiltros(): void {
    let filtradas = [...this.atividadesOriginais];

    if (this.termoBusca) {
      const termo = this.termoBusca.toLowerCase();
      filtradas = filtradas.filter(atv =>
        atv.descricao?.toLowerCase().includes(termo) ||
        atv.tipoAtividadeNome?.toLowerCase().includes(termo) ||
        atv.responsavelNome?.toLowerCase().includes(termo) ||
        atv.equipamentosNomes?.toLowerCase().includes(termo)
      );
    }

    if (this.filtroTipo !== 'ALL') {
      filtradas = filtradas.filter(atv => atv.tipoAtividadeNome === this.filtroTipo);
    }

    if (this.filtroSetor !== 'ALL') {
      filtradas = filtradas.filter(atv => atv.setorNome === this.filtroSetor);
    }

    this.atividades = filtradas;
  }

  abrirModal(): void {
    this.atividadeSelecionada = null;
    this.mostrarModal = true;
  }

  abrirModalEdicao(atividade: any): void {
    this.atividadeSelecionada = atividade;
    this.mostrarModal = true;
  }

  fecharModal(): void {
    this.mostrarModal = false;
    this.atividadeSelecionada = null;
  }

  deletarAtividade(id: number): void {
    this.idAtividadeExcluir = id;
  }

  aoConfirmarExclusao(confirmado: boolean): void {
    if (confirmado && this.idAtividadeExcluir !== null) {
      this.atividadeService.deletar(this.idAtividadeExcluir).subscribe({
        next: () => {
          this.carregarAtividades();
          this.idAtividadeExcluir = null;
        },
        error: (erro) => {
          console.error('Erro ao excluir', erro);
          alert('Não foi possível excluir a atividade.');
          this.idAtividadeExcluir = null;
        }
      });
    } else {
      this.idAtividadeExcluir = null;
    }
  }
}