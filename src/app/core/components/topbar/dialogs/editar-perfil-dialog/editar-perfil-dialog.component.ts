import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DocumentoUtils } from 'src/app/core/utils/documento.util';

@Component({
  selector: 'app-editar-perfil-dialog',
  templateUrl: './editar-perfil-dialog.component.html',
  styleUrls: ['./editar-perfil-dialog.component.scss']
})
export class EditarPerfilDialogComponent implements OnInit {

  @Input() usuario: any;
  @Output() fechar = new EventEmitter<void>();
  @Output() salvar = new EventEmitter<any>();

  dadosEdicao: any = {};
  erroValidacao: string | null = null;

  ngOnInit(): void {
    this.dadosEdicao = { ...this.usuario };
    
    if (this.dadosEdicao.cpf) {
      this.dadosEdicao.cpf = DocumentoUtils.formatarDocumento(this.dadosEdicao.cpf);
    }
  }

  cancelar(): void {
    this.fechar.emit();
  }

  onCpfChange(valor: string): void {
    this.dadosEdicao.cpf = DocumentoUtils.formatarDocumento(valor);
  }

  confirmar(): void {
    this.erroValidacao = null;

    if (!this.dadosEdicao.nomeCompleto || !this.dadosEdicao.nomeUsuario || !this.dadosEdicao.email) {
      this.erroValidacao = 'Nome completo, nome de usuário e e-mail são obrigatórios!';
      return;
    }

    if (this.dadosEdicao.cpf && !DocumentoUtils.isDocumentoValido(this.dadosEdicao.cpf)) {
      this.erroValidacao = 'O CPF informado é inválido.';
      return;
    }

    // NOVA VALIDAÇÃO: Autenticação dupla de senha
    if (this.dadosEdicao.senha) {
      if (this.dadosEdicao.senha !== this.dadosEdicao.confirmarSenha) {
        this.erroValidacao = 'As senhas não coincidem!';
        return;
      }
    }

    // CLONAGEM SEGURA: Removemos campos exclusivos do frontend antes de enviar à API
    const payloadParaBackend = { ...this.dadosEdicao };
    delete payloadParaBackend.confirmarSenha; // O Java não precisa e não deve receber isso

    // Se a senha estiver vazia, removemos para o Java não tentar processar uma string vazia
    if (!payloadParaBackend.senha || payloadParaBackend.senha.trim() === '') {
        delete payloadParaBackend.senha;
    }

    this.salvar.emit(payloadParaBackend);
  }
}