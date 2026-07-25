import { Component, inject, EventEmitter, Output, OnInit, signal, effect, computed, HostListener, ElementRef } from '@angular/core' // signal pra resolver o problema de Detecção de Mudanças (Change Detection)
import { temporadaService } from '../../core/services/temporada-services'
import { AulaService } from '../../core/services/aula-services'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { AlunoService } from '../../core/services/aluno-service'
import { AlunoMapper } from '../../core/mappers/aluno-mapper'
import { NovaTemporada } from './componentes/cadastro-temporada/cadastro-temporada'
import { CriarOficina } from '../../shared/models/oficina-models'
import { EditarOficina } from './componentes/editar-oficina/editar-oficina'
import { NovaOficina } from './componentes/nova-oficina/nova-oficina'
import { Grupo } from '../../shared/models/grupo-model'



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
  listaTemporadas = signal<any[]>([])
  temporada = signal<any>(null)
  oficinas = signal<any[]>([])
  alunos = signal<any[]>([])
  menuAbertoId = signal<number | null>(null)
  temporadaParaExcluir = signal<any | null>(null)
  dropdownTemporadaAberto = false
  mostrarModalCriarTemporada = false
  mostrarModalOficina = false
  mostrarModalEditarOficina = false
  oficinaParaEditar = signal<any | null>(null)
  grupos: Grupo[] = []
  @Output() fechar = new EventEmitter<void>() 

  ngOnInit() {
    this.carregarAlunos()   
    this.carregarDadosIniciais()
  }

  toggleDropdownTemporada() {
    this.dropdownTemporadaAberto = !this.dropdownTemporadaAberto
  }

  selecionarTemporada(temp: any) {
    this.temporada.set(temp)
    this.dropdownTemporadaAberto = false
  }

  getTemporadaSelecionadaNome(): string {
    const temporada = this.temporada()

    if (!temporada) {
      return 'Selecione uma temporada'
    }

    return temporada.Nome
  }

  abrirModalCriarTemporada() { this.mostrarModalCriarTemporada = true }
  fecharModalCriarTemporada() { this.mostrarModalCriarTemporada = false }

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
    return this.grupos.filter(o => o.id === 1).length
  })

  totalProducao = computed(() => {
    return this.grupos.filter(o => o.id === 2).length
  })

  totalDesign = computed(() => {
    return this.grupos.filter(o => o.id === 3).length
  })

  carregarDadosIniciais() {
    this.temporadaService.listarTemporadas().subscribe({
      next: (temporadas) => {
        this.listaTemporadas.set(temporadas)
        if(temporadas.length > 0) {
          this.temporada.set(temporadas[0])
        }
        this.totalFotografia
        this.totalDesign
        this.totalProducao
      },
      error: (err) => console.error('Erro ao buscar temporadas:', err)
    })
  }

  carregarAulas(temporadaId: number) {
    this.aulaService.listarAulas(temporadaId).subscribe({
      next: res => {
        this.oficinas.set(res)
      },
      error: err => {
        console.error('Erro ao carregar aulas', err)
        console.log(err.error)
      }
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
        this.fecharModalCriarTemporada()
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

  atualizarTemporada(dados: any) {
    this.temporadaService.atualizar(dados.id, dados).subscribe({
      next: () => {
        this.carregarDadosIniciais()
        this.fecharModalCriarTemporada()
      }
    })
  }

  excluirTemporada(id: number) {
    this.temporadaService.excluirTemporada(id).subscribe({
      next: () => {
        this.carregarDadosIniciais()
      }
    })
  }

  executarExclusaoTemporada() {
    const temp = this.temporadaParaExcluir()
    if (temp) {
      this.temporadaService.excluirTemporada(temp.Id).subscribe({
        next: () => {
          this.temporadaParaExcluir.set(null) // Fecha o modal de confirmação
          this.carregarDadosIniciais()        // Atualiza a listagem
        },
        error: (err) => console.error("Erro ao excluir temporada:", err)
      })
    }
  }


  @HostListener('document:click', ['$event'])
    cliqueFora(event: Event) {
      const alvo = event.target as HTMLElement
      if(alvo.closest('.dropdown-temporada')) {
        return
      }
      this.dropdownTemporadaAberto = false
    }

  fecharModal() {
    this.fechar.emit()
  }
  // this.salvar.emit(NovaTemporada)
  // this.fecharModal()
}