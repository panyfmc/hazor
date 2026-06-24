import { Component, inject, OnInit, signal, computed, HostListener } from '@angular/core'
import { temporadaService } from '../../../../core/services/temporada-services'
import { aulaService } from '../../../../core/services/aulas-services'
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
    private aulaService = inject(aulaService)
    private alunoService = inject(AlunoService)
    listaTemporadas = signal<any[]>([])
    temporada = signal<any>(null)
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
        this.temporadaService.buscarAtiva().subscribe(res => {
            this.temporada.set(res)
            if (res?.Id) {
                this.buscarDadosDaTemporada(res.Id)
            }
        })
        this.carregarAlunos()
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

    // Seus outros métodos continuam exatamente aqui embaixo...
    buscarDadosDaTemporada(id: number) {
        this.aulaService.listarAulas(id).subscribe(aulas => this.oficinas.set(aulas))
    }
    mudarTemporada(event: Event) {
        const selectElement = event.target as HTMLSelectElement
        const temporadaId = Number(selectElement.value)

        if (temporadaId) {
            this.buscarDadosDaTemporada(temporadaId)
        }
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