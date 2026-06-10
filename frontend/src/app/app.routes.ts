import { Routes } from '@angular/router';
import { DashboardLayout } from './core/layout/dashboard-layout/dashboard-layout'; // Ajuste o caminho

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard/alunos',
    pathMatch: 'full' // Redireciona o link inicial direto para os alunos
  },
  {
    path: 'dashboard',
    component: DashboardLayout, // O Layout envelopa as telas filhas
    children: [
      {
        path: 'alunos',
        // Lazy Loading (Carrega a tela apenas quando o usuário acessa, deixando o app super rápido)
        loadComponent: () => import('./features/alunos/alunos').then(m => m.Alunos)
      },
      // Exemplo de tela futura:
      // {
      //   path: 'oficinas',
      //   loadComponent: () => import('./features/oficinas/oficinas').then(m => m.Oficinas)
      // }
    ]
  }
];