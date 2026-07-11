import { Component, inject, OnInit, effect, signal, computed, HostListener } from '@angular/core'
import { temporadaService } from '../../../../core/services/temporada-services'
import { AulaService } from '../../../../core/services/aulas-services'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { AlunoService } from '../../../../core/services/aluno-service'
import { AlunoMapper } from '../../../../core/mappers/aluno-mapper'

@Component({
    selector: 'app-historico-completo',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './historico-completo.html'
})
export class HistoricoCompleto implements OnInit { // <-- Contrato assinado aqui
    private temporadaService = inject(temporadaService)
    private aulaService = inject(AulaService)
    private alunoService = inject(AlunoService)
    listaTemporadas = signal<any[]>([])
    temporada = signal<any>(null)
    dropdownTemporadaAberto = false
    oficinas = signal<any[]>([])
    alunos = signal<any[]>([])
    paginaAtual = signal<number>(1)
    itensPorPagina = 10
    departamentoSelecionado = signal<string>('')
    filtroData = signal<string>('')
    menuAbertoId = signal<number | null>(null)
    oficinaParaExcluirId = signal<number | null>(null)

    totalAlunosAtivos = computed(() => {
        return this.alunos().length
    })

    ngOnInit() {
        this.carregarAlunos()
        this.carregarDadosTemporada()
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

    oficinasFiltradas = computed(() => {
        return this.oficinas().filter(oficina => {
            const deptoMatch = !this.departamentoSelecionado() || 
                                oficina.DepartamentoId === Number(this.departamentoSelecionado())
            
            const dataMatch = !this.filtroData() || 
                            oficina.DataAula.includes(this.filtroData())

            return deptoMatch && dataMatch
        })
    })

    totalPaginas = computed(() => {
        return Math.ceil(this.oficinasFiltradas().length / this.itensPorPagina) || 1
    })

    oficinasFiltradasPaginadas = computed(() => {
        const inicio = (this.paginaAtual() - 1) * this.itensPorPagina
        const fim = inicio + this.itensPorPagina
        return this.oficinasFiltradas().slice(inicio, fim)
    })

    constructor() {
        this.departamentoSelecionado.set('') 
        effect(() => {
            const tempId = this.temporada()?.Id
            if(tempId) {
                this.carregarAulas(tempId)
            }

        })
    }

    private carregarAulas(temporadaId: number) {
        this.aulaService.listarAulas(temporadaId).subscribe(res => {
        this.oficinas.set(res) // Alimenta o signal das oficinas
        })
    }

    toggleDropdownTemporada() {
        this.dropdownTemporadaAberto = !this.dropdownTemporadaAberto
    }

    selecionarTemporada(temp: any) {
        this.temporada.set(temp)
        this.dropdownTemporadaAberto = false
    }

    carregarDadosTemporada() {
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

    proximaPagina() {
        if(this.paginaAtual() < this.totalPaginas()) {
            this.paginaAtual.update(p => p + 1)
        }
    }

    paginaAnterior() {
        if(this.paginaAtual() > 1) {
            this.paginaAtual.update(p => p - 1)
        }
    }

    buscarPorData(event: Event) {
        const valor = (event.target as HTMLInputElement).value
        this.filtroData.set(valor)
        this.paginaAtual.set(1) 
    }

    @HostListener('document:click')

    fecharMenus() {
        this.menuAbertoId.set(null)
    }

    alternarMenu(id: number, event: Event) {
        event.stopPropagation()
        this.menuAbertoId.set(this.menuAbertoId() === id ? null : id)
    }

    confirmarExclusao(id: number) {
        this.oficinaParaExcluirId.set(id)
        this.menuAbertoId.set(null)
    }

    executarExclusao() {
        const id = this.oficinaParaExcluirId()
        if (id) {
            console.log('Excluindo oficina de ID:', id)
            this.oficinaParaExcluirId.set(null)
        }
    }

    editar(oficina: any) {
        console.log('Editar oficina:', oficina)
    }
}