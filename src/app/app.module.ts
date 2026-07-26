import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxMaskDirective, NgxMaskPipe, provideEnvironmentNgxMask } from 'ngx-mask';
import { HTTP_INTERCEPTORS } from '@angular/common/http'; 
import { JwtInterceptor } from './core/interceptors/jwt.interceptor'; 
import { FormsModule } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms'; 
import { MatIconModule } from '@angular/material/icon';
import { HttpClientModule } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar'; 

import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { RegistrarComponent } from './pages/registrar/registrar.component';
import { PainelComponent } from './pages/painel/painel.component';
import { SidebarComponent } from './core/components/sidebar/sidebar.component';
import { TopbarComponent } from './core/components/topbar/topbar.component';
import { PropriedadesComponent } from './pages/propriedades/propriedades.component';
import { RegistroPropriedadeDialogComponent } from './pages/propriedades/dialogs/registro-propriedade-dialog/registro-propriedade-dialog.component';
import { DetalhesPropriedadeDialogComponent } from './pages/propriedades/dialogs/detalhes-propriedade-dialog/detalhes-propriedade-dialog.component';
import { ConfirmarExclusaoDialogComponent } from './pages/propriedades/dialogs/confirmar-exclusao-dialog/confirmar-exclusao-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    RegistrarComponent,
    PainelComponent,
    SidebarComponent,
    TopbarComponent,
    PropriedadesComponent,
    RegistroPropriedadeDialogComponent,
    DetalhesPropriedadeDialogComponent,
    ConfirmarExclusaoDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatIconModule,
    HttpClientModule,
    MatSnackBarModule,
    NgxMaskDirective, 
    NgxMaskPipe,
    HttpClientModule,
    FormsModule
  ],
  providers: [
    provideEnvironmentNgxMask(),
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }