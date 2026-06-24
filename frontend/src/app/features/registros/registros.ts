import { Component, inject, OnInit, signal, effect, computed } from '@angular/core' // signal pra resolver o problema de Detecção de Mudanças (Change Detection)
import { temporadaService } from '../../core/services/temporada-services'
import { aulaService } from '../../core/services/aulas-services'
import { CommonModule } from '@angular/common'

@Component({
  selector: 'app-registros',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './registros.html'
})
export class Registros implements OnInit {
  private temporadaService = inject(temporadaService)
  private aulaService = inject(aulaService)
  // Inicializa a temporada como um Signal
  temporada = signal<any>(null)
  oficinas = signal<any[]>([])

  limiteExibicao = computed(() => {
    return this.oficinas().slice(0, 5)
  })

  constructor() {
    effect(() => {
      const tempId = this.temporada()?.Id
      if(tempId) {
        this.carregarAulas(tempId)
      }
    })
  }

  ngOnInit() {
    this.temporadaService.buscarAtiva().subscribe(res => {
      this.temporada.set(res)
    })
  }

  private carregarAulas(temporadaId: number) {
    this.aulaService.listarAulas(temporadaId).subscribe(res => {
      this.oficinas.set(res) // Alimenta o signal das oficinas
    })
  }
}