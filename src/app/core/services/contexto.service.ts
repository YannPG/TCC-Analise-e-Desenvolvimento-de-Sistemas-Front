import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContextoService {
  private propriedadeSelecionadaSource = new BehaviorSubject<number | null>(null);
  
  propriedadeAtual$ = this.propriedadeSelecionadaSource.asObservable();

  constructor() { }

  mudarPropriedade(id: number | null): void {
    const valorFinal = id === 'null' as any ? null : Number(id);
    this.propriedadeSelecionadaSource.next(valorFinal);
  }

  getPropriedadeAtual(): number | null {
    return this.propriedadeSelecionadaSource.getValue();
  }
}