import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegistrarComponent } from './pages/registrar/registrar.component';
import { authGuard } from './core/guards/auth.guard';
import { PainelComponent } from './pages/painel/painel.component';
import { HomeComponent } from './pages/home/home.component';
import { PropriedadesComponent } from './pages/propriedades/propriedades.component'; 
import { SetoresComponent } from './pages/setores/setores.component'; 
import { EquipamentosComponent } from './pages/equipamentos/equipamentos.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registrar', component: RegistrarComponent },
  { 
    path: 'painel', 
    component: PainelComponent, 
    canActivate: [authGuard],
    children: [
      { 
        path: 'propriedades', 
        component: PropriedadesComponent 
      },
      {
        path: 'setores',
        component: SetoresComponent
      },
      { 
        path: 'equipamentos', 
        component: EquipamentosComponent 
      },
    ]
  },
  
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }