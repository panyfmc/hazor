import { Component, inject, EventEmitter, Output, OnInit, signal, effect, computed, HostListener, ElementRef } from '@angular/core' // signal pra resolver o problema de Detecção de Mudanças (Change Detection)
import { temporadaService } from '../../core/services/temporada-service'
import { OficinaService } from '../../core/services/oficina-service'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { AlunoService } from '../../core/services/aluno-service'
import { AlunoMapper } from '../../core/mappers/aluno-mapper'
import { NovaTemporada } from './componentes/cadastro-temporada/cadastro-temporada'
import { CriarOficina, Oficina } from '../../shared/models/aula-models'
import { EditarOficina } from './componentes/editar-oficina/editar-oficina'
import { NovaOficina } from './componentes/nova-oficina/nova-oficina'
import { EditarTemporada } from './componentes/editar-temporada/editar-temporada'
import { TemporadaMapper } from '../../core/mappers/temporada-mapper'
import { OficinaMapper } from '../../core/mappers/oficina-mapper'



@Component({ 
  selector: 'app-registros',
  standalone: true,
  imports: [CommonModule, RouterModule, NovaTemporada, NovaOficina, EditarOficina, EditarTemporada],
  templateUrl: './registros.html'
})
export class Registros implements OnInit {
  private temporadaService = inject(temporadaService)
  private oficinaService = inject(OficinaService)
  private alunoService = inject(AlunoService)
  listaTemporadas = signal<any[]>([])
  temporada = signal<any>(null)
  oficinas = signal<any[]>([])
  alunos = signal<any[]>([])
  menuAbertoId = signal<number | null>(null)
  temporadaParaExcluir = signal<any | null>(null)
  temporadaParaEditar = signal<any | null>(null)
  dropdownTemporadaAberto = false
  mostrarModalCriarTemporada = false
  mostrarModalEditarTemporada = false
  mostrarModalOficina = false
  mostrarModalEditarOficina = false
  oficinaParaEditar = signal<any | null>(null)
  aulasPorDepartamento: Oficina[] = []
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

    return temporada.nome
  }

  abrirModalCriarTemporada() { this.mostrarModalCriarTemporada = true }
  fecharModalCriarTemporada() { this.mostrarModalCriarTemporada = false }

  abrirModalEditarTemporada() { this.mostrarModalEditarTemporada = true }
  fecharModalEditarTemporada() { this.mostrarModalEditarTemporada = false }

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
      const tempId = this.temporada()?.id
      if(tempId) {
        this.carregarOficinas(tempId)
      }
    })
  }

  totalFotografia = computed(() => {
    return this.aulasPorDepartamento.filter(o => o.id === 1).length
  })

  totalProducao = computed(() => {
    return this.aulasPorDepartamento.filter(o => o.id === 2).length
  })

  totalDesign = computed(() => {
    return this.aulasPorDepartamento.filter(o => o.id === 3).length
  })

  carregarDadosIniciais() {
    this.temporadaService.listarTemporadas().subscribe({
      next: (temporadasB: any[]) => {
        const temporadasMap = temporadasB.map(TemporadaMapper.fromApi)
        this.listaTemporadas.set(temporadasMap)
        if(temporadasMap.length > 0) {
          this.temporada.set(temporadasMap[0])
        }
        this.totalFotografia
        this.totalDesign
        this.totalProducao
      },
      error: (err) => console.error('Erro ao buscar temporadas:', err)
    })
  }

  carregarOficinas(temporadaId: number) {
    this.oficinaService.listarOficinas(temporadaId).subscribe({
      next: (res: any[]) => {
        const aulasMap = res.map(OficinaMapper.fromApi)
        this.oficinas.set(aulasMap)
      },
      error: err => {
        console.error('Erro ao carregar oficinas', err)
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

  salvarEditarTemporada(dados: any) {
    this.temporadaService.atualizarTemporada(dados.id, dados).subscribe({
      next: () => {
        this.carregarDadosIniciais()
        this.temporadaParaEditar.set(null)
        this.fecharModalEditarTemporada()
      },
      error: (err) => console.error(err)
    })
  }

  salvarNovaOficina(oficina: CriarOficina) {
    this.oficinaService.criarOficina(oficina).subscribe({
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
    this.oficinaService.atualizar(dados.id, dados).subscribe({
      next: () => {
        console.log("✅ SALVOU com sucesso!")
        this.carregarDadosIniciais()
        this.fecharModalEditarOficina()
      },
      error: (err) => console.error('Erro ao salvar:', err)
    })
  }

  atualizarTemporada(dados: any) {
    this.temporadaService.atualizarTemporada(dados.id, dados).subscribe({
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

  executarExclusaoTemporada(id: number) {
    this.temporadaService.excluirTemporada(id).subscribe({
      next: () => {
        this.temporadaParaEditar.set(null) // Garante o fechamento total do modal
        this.carregarDadosIniciais()      // Recarrega a listagem atualizada
      },
      error: (err) => console.error("Erro ao excluir temporada:", err)
    })
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