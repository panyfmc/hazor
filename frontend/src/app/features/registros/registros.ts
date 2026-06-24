import { Component, inject, OnInit, signal, effect, computed, HostListener } from '@angular/core' // signal pra resolver o problema de Detecção de Mudanças (Change Detection)
import { temporadaService } from '../../core/services/temporada-services'
import { aulaService } from '../../core/services/aulas-services'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { AlunoService } from '../../core/services/aluno-service'
import { AlunoMapper } from '../../core/mappers/aluno-mapper'

@Component({
  selector: 'app-registros',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './registros.html'
})
export class Registros implements OnInit {
  private temporadaService = inject(temporadaService)
  private aulaService = inject(aulaService)
  private alunoService = inject(AlunoService)
  // Inicializa a temporada como um Signal
  temporada = signal<any>(null)
  oficinas = signal<any[]>([])
  alunos = signal<any[]>([])
  menuAbertoId = signal<number | null>(null)


  limiteExibicao = computed(() => {
    return this.oficinas().slice(0, 5)
  })

  totalAlunosAtivos = computed(() => {
    return this.alunos().length
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
    this.carregarAlunos()   // carrega a quantidade de alunos assim que a tela abre
  }

  private carregarAulas(temporadaId: number) {
    this.aulaService.listarAulas(temporadaId).subscribe(res => {
      this.oficinas.set(res) // Alimenta o signal das oficinas
    })
  }

  carregarAlunos() {
    this.alunoService.listar().subscribe({
      next: (dados: any[]) => {
        const mapeado = dados.map(AlunoMapper.fromApi)
        this.alunos.set(mapeado) 
      },
      error: (erro) => console.error(erro)
    })
  }

  @HostListener('document:click')
    fecharMenus() {
        this.menuAbertoId.set(null)
    }

    alternarMenu(id: number, event: Event) {
        event.stopPropagation()
        this.menuAbertoId.set(this.menuAbertoId() === id ? null : id)
    }
}