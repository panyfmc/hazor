import { Routes } from '@angular/router';
import { DashboardLayout } from './core/layout/dashboard-layout/dashboard-layout'

export const routes: Routes = [
  {
    path: '',
    component: DashboardLayout,
    children: [
      {
        path: '',
        redirectTo: 'alunos',
        pathMatch: 'full'
      },
      {
        path: 'alunos',
        loadComponent: () =>
          import('./features/alunos/alunos').then(m => m.Alunos)
      },
      {
        path: 'registros',
        loadComponent: () =>
          import('./features/registros/registros').then(m => m.Registros)
      },
      {
        path: 'inativos',
        loadComponent: () =>
          import('./features/inativos/inativos').then(m => m.Inativos)
      }
    ]
  }
]