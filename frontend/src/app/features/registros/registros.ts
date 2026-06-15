import { Component, inject, OnInit, signal } from '@angular/core' // signal pra resolver o problema de Detecção de Mudanças (Change Detection)
import { temporadaService } from '../../core/services/temporada-services'

@Component({
  selector: 'app-registros',
  standalone: true,
  templateUrl: './registros.html'
})
export class Registros implements OnInit {
  private temporadaService = inject(temporadaService)
  // Inicializa a temporada como um Signal
  temporada = signal<any>(null)
  ngOnInit() {
    this.temporadaService.buscarAtiva().subscribe(res => {
      this.temporada.set(res)
    })
  }
}