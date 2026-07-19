import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly baseUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient, private router: Router) {}
  realizarLogin(credenciais: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, credenciais);
  }

  registrarUsuario(dadosRegistro: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/registrar`, dadosRegistro);
  }

  armazenarToken(token: string): void {
    localStorage.setItem('sifeo_token', token);
  }

  obterToken(): string | null {
    return localStorage.getItem('sifeo_token');
  }

  limparSessao(): void {
    localStorage.removeItem('sifeo_token');
  }

  deslogar(): void {
    localStorage.removeItem('sifeo_token');
    localStorage.removeItem('sifeo_nome');
    this.router.navigate(['/login']);
  }
}