import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Topbar } from '../topbar/topbar';
import { Alunos } from '../../../features/alunos/alunos';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    Topbar,
    Alunos
  ],
  templateUrl: './dashboard-layout.html',
  styleUrl: './dashboard-layout.css'
})
export class DashboardLayout {}