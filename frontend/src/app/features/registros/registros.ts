import { Component, inject, OnInit, signal, effect, computed, HostListener, ElementRef } from '@angular/core' // signal pra resolver o problema de Detecção de Mudanças (Change Detection)
import { temporadaService } from '../../core/services/temporada-services'
import { aulaService } from '../../core/services/aulas-services'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { AlunoService } from '../../core/services/aluno-service'
import { AlunoMapper } from '../../core/mappers/aluno-mapper'
import { NovaTemporada } from './componentes/nova-temporada/nova-temporada'

@Component({
  selector: 'app-registros',
  standalone: true,
  imports: [CommonModule, RouterModule, NovaTemporada],
  templateUrl: './registros.html'
})
export class Registros implements OnInit {
  private temporadaService = inject(temporadaService)
  private aulaService = inject(aulaService)
  private alunoService = inject(AlunoService)
  private elementRef = inject(ElementRef)
  // Inicializa a temporada como um Signal
  listaTemporadas = signal<any[]>([])
  temporada = signal<any>(null)
  oficinas = signal<any[]>([])
  alunos = signal<any[]>([])
  menuAbertoId = signal<number | null>(null)
  dropdownTemporadaAberto = false
  mostrarModalCadastro = false

  abrirModal() { this.mostrarModalCadastro = true }
  fecharModal() { this.mostrarModalCadastro = false }

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

  totalFotografia = computed(() => {
    return this.oficinas().filter(o => o.DepartamentoId === 1).length
  })

  totalProducao = computed(() => {
    return this.oficinas().filter(o => o.DepartamentoId === 2).length
  })

  totalDesign = computed(() => {
    return this.oficinas().filter(o => o.DepartamentoId === 3).length
  })

  ngOnInit() {
    this.temporadaService.buscarAtiva().subscribe(res => {
      this.temporada.set(res)
    })
    this.carregarAlunos()   // carrega a quantidade de alunos assim que a tela abre
    this.carregarDadosIniciais()

  }

  carregarDadosIniciais() {
    this.temporadaService.listarTemporadas().subscribe({
      next: (dadosDoBanco) => {
        this.listaTemporadas.set(dadosDoBanco)
        const ativa = dadosDoBanco.find(temp => temp.Ativa === 1)
        if (ativa) {
          this.temporada.set(ativa)
        } else if (dadosDoBanco.length > 0) {
          this.temporada.set(dadosDoBanco[0])
        }
      },
      error: (err) => {
        console.error('Erro ao buscar temporadas do banco:', err)
      }
    })
  }

  toggleDropdownTemporada() {
    this.dropdownTemporadaAberto = !this.dropdownTemporadaAberto
  }

  selecionarTemporada(temp: any) {
    this.temporada.set(temp)
    this.dropdownTemporadaAberto = false
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

  salvarNovaTemporada(novo: any) {
    this.temporadaService.criarTemporada(novo).subscribe({
      next: () => {
        this.carregarDadosIniciais(),
        this.fecharModal()
      },
      error: erro => console.error('Erro ao salvar temporada:', erro)
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