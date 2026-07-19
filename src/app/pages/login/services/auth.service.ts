import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly baseUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {}

  realizarLogin(credenciais: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, credenciais);
  }

  registrarUsuario(dadosRegistro: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/registrar`, dadosRegistro);
  }

  tokenExpirado(): boolean {
    const token = this.obterToken();
    if (!token) return true;

    try {
      const payloadBase64 = token.split('.')[1];
      const payloadDecodificado = JSON.parse(atob(payloadBase64));
      
      const tempoExpiracao = payloadDecodificado.exp * 1000;
      return Date.now() > tempoExpiracao;
    } catch (e) {
      return true; 
    }
  }

  armazenarToken(token: string): void {
    localStorage.setItem('sifeo_token', token);
  }

  obterToken(): string | null {
    return localStorage.getItem('sifeo_token');
  }

  deslogar(): void {
    localStorage.removeItem('sifeo_token');
    localStorage.removeItem('sifeo_nome');
  }
}