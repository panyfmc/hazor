import { Component, inject, OnInit, signal, effect, computed, HostListener, ElementRef } from '@angular/core' // signal pra resolver o problema de Detecção de Mudanças (Change Detection)
import { temporadaService } from '../../core/services/temporada-services'
import { AulaService } from '../../core/services/aulas-services'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { AlunoService } from '../../core/services/aluno-service'
import { AlunoMapper } from '../../core/mappers/aluno-mapper'
import { NovaTemporada } from './componentes/nova-temporada/nova-temporada'
import { CriarOficina, NovaOficina } from './componentes/nova-oficina/nova-oficina'
import { EditarOficina } from './componentes/editar-oficina/editar-oficina'

@Component({ 
  selector: 'app-registros',
  standalone: true,
  imports: [CommonModule, RouterModule, NovaTemporada, NovaOficina, EditarOficina],
  templateUrl: './registros.html'
})
export class Registros implements OnInit {
  private temporadaService = inject(temporadaService)
  private aulaService = inject(AulaService)
  private alunoService = inject(AlunoService)
  private elementRef = inject(ElementRef)
  // Inicializa a temporada como um Signal
  listaTemporadas = signal<any[]>([])
  temporada = signal<any>(null)
  oficinas = signal<any[]>([])
  alunos = signal<any[]>([])
  menuAbertoId = signal<number | null>(null)
  temporadaParaExcluir = signal<any | null>(null)
  dropdownTemporadaAberto = false
  mostrarModalTemporada = false
  mostrarModalOficina = false
  mostrarModalEditarOficina = false
  oficinaParaEditar = signal<any | null>(null)

  abrirModalTemporada() { this.mostrarModalTemporada = true }
  fecharModalTemporada() { this.mostrarModalTemporada = false }

  abrirModalOficina() { this.mostrarModalOficina = true }
  fecharModalNovaOficina() { this.mostrarModalOficina = false }

  abrirModalEditarOficina(oficina: any) {
    this.oficinaParaEditar.set(oficina)
    console.log(oficina)
    this.mostrarModalEditarOficina = true
  }

  fecharModalEditarOficina() {
    this.mostrarModalEditarOficina = false
    this.oficinaParaEditar.set(null)
  }

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
    
    this.carregarAlunos()   
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
      error: (err) => console.error('Erro ao buscar temporadas:', err)
    })

    const tempId = this.temporada()?.Id
    if (tempId) {
      this.aulaService.listarAulas(tempId).subscribe({
        next: (oficinas) => {
          this.oficinas.set(oficinas)
        },
        error: (err) => console.error('Erro ao recarregar oficinas:', err)
      })
    }
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
        this.fecharModalTemporada()
      },
      error: erro => console.error('Erro ao salvar temporada:', erro)
    })
  }

  salvarNovaOficina(oficina: CriarOficina) {
    this.aulaService.criarAula(oficina).subscribe({
      next: () => {
        this.carregarDadosIniciais()
        this.fecharModalNovaOficina()
      },
      error: err => {
        console.error(err)
      }
    })
  }

  salvarEditarOficina(dados: any) {
    this.aulaService.atualizar(dados.id, dados).subscribe({
      next: () => {
        console.log("✅ SALVOU com sucesso!")
        this.carregarDadosIniciais()
        this.fecharModalEditarOficina()
      },
      error: (err) => console.error('Erro ao salvar:', err)
    })
  }

  excluirTemporada(id: number) {
    this.temporadaService.excluir(id).subscribe({
      next: () => {
        this.carregarDadosIniciais()
      }
    })
  }

  executarExclusaoTemporada() {
    const temp = this.temporadaParaExcluir()
    if (temp) {
      this.temporadaService.excluir(temp.Id).subscribe({
        next: () => {
          this.temporadaParaExcluir.set(null) // Fecha o modal de confirmação
          this.carregarDadosIniciais()        // Atualiza a listagem
        },
        error: (err) => console.error("Erro ao excluir temporada:", err)
      })
    }
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