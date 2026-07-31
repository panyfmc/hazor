import { Component, inject, OnInit, effect, signal, computed, HostListener } from '@angular/core'
import { temporadaService } from '../../../../core/services/temporada-service'
import { OficinaService } from '../../../../core/services/oficina-service'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { AlunoService } from '../../../../core/services/aluno-service'
import { AlunoMapper } from '../../../../core/mappers/aluno-mapper'
import { EditarOficina } from '../editar-oficina/editar-oficina'
import { TemporadaMapper } from '../../../../core/mappers/temporada-mapper'
import { OficinaMapper } from '../../../../core/mappers/oficina-mapper'

@Component({
    selector: 'app-historico-completo',
    standalone: true,
    imports: [CommonModule, RouterModule, EditarOficina],
    templateUrl: './historico-completo.html'
})
export class HistoricoCompleto implements OnInit {
    private temporadaService = inject(temporadaService)
    private oficinaService = inject(OficinaService)
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
    oficinaParaEditar = signal<any | null>(null)
    mostrarModalEditarOficina = false

    constructor() {
        this.departamentoSelecionado.set('') 
        effect(() => {
            const tempId = this.temporada()?.id || this.temporada()?.Id
            if (tempId) {
                this.carregarOficinas(tempId)
            }
        })
    }

    ngOnInit() {
        this.carregarAlunos()
        this.carregarDadosTemporada() 
    }

    // ==================== Carregamento de Dados ====================
    carregarDadosTemporada() {
        this.temporadaService.listarTemporadas().subscribe({
            next: (dadosDoBanco) => {
                const temporadasMap = dadosDoBanco.map(TemporadaMapper.fromApi)
                this.listaTemporadas.set(temporadasMap)
                
                if (temporadasMap.length > 0) {
                    this.temporada.set(temporadasMap[0])
                }
            },
            error: (err) => console.error('Erro ao buscar temporadas do banco:', err)
        })
    }

    carregarOficinas(temporadaId: number) {
        this.oficinaService.listarOficinas(temporadaId).subscribe({
            next: (res: any[]) => {
                const aulasMap = res.map(OficinaMapper.fromApi)
                this.oficinas.set(aulasMap)
            },
            error: (err) => console.error('Erro ao carregar oficinas:', err)
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

    // ==================== Modais de Edição e Exclusão ====================
    abrirModalEditarOficina(oficina: any) {
        this.mostrarModalEditarOficina = true
        this.oficinaParaEditar.set({
            id: oficina.id || oficina.Id,
            departamentoId: oficina.departamentoId || oficina.DepartamentoId || null,
            dataAula: oficina.dataAula || oficina.DataAula || '',
            teveAtividade: oficina.teveAtividade ?? oficina.TeveAtividade ?? true,
            presentes: []
        })

        this.oficinaService.buscarPorId(oficina.id || oficina.Id).subscribe({
            next: (oficinaCompleta) => {
                const dadosNormalizados = {
                    id: oficinaCompleta.Id || oficinaCompleta.id,
                    temporadaId: oficinaCompleta.TemporadaId || oficinaCompleta.temporadaId,
                    departamentoId: oficinaCompleta.DepartamentoId || oficinaCompleta.departamentoId,
                    dataAula: oficinaCompleta.DataAula || oficinaCompleta.dataAula,
                    teveAtividade: oficinaCompleta.TeveAtividade ?? oficinaCompleta.teveAtividade,
                    presentes: oficinaCompleta.presentes || []
                }
                this.oficinaParaEditar.set(dadosNormalizados) 
            },
            error: (err) => console.error('Erro ao buscar detalhes da oficina:', err)
        })
    }

    fecharModalEditarOficina() {
        this.mostrarModalEditarOficina = false
        this.oficinaParaEditar.set(null)
    }

    salvarEditarOficina(dados: any) {
        this.oficinaService.atualizar(dados.id, dados).subscribe({
            next: () => {
                console.log("✅ SALVOU com sucesso!")
                const tempId = this.temporada()?.id || this.temporada()?.Id
                if (tempId) this.carregarOficinas(tempId) 
                this.fecharModalEditarOficina()
            },
            error: (err) => console.error('Erro ao salvar:', err)
        })
    }

    executarExclusaoOficina(id: number) {
        this.oficinaService.excluir(id).subscribe({
            next: () => {
                console.log('Oficina excluída com sucesso!')
                const tempId = this.temporada()?.id || this.temporada()?.Id
                if (tempId) this.carregarOficinas(tempId)
                this.oficinaParaExcluirId.set(null)
            },
            error: (err) => console.error("Erro ao excluir oficina", err)
        })
    }

    // ==================== Filtros e Paginação Computados ====================
    totalAlunosAtivos = computed(() => this.alunos().length)

    oficinasFiltradas = computed(() => {
        return this.oficinas().filter(oficina => {
            const deptoId = oficina.departamentoId || oficina.DepartamentoId
            const dataAula = oficina.dataAula || oficina.DataAula || ''

            const deptoMatch = !this.departamentoSelecionado() || 
                               Number(deptoId) === Number(this.departamentoSelecionado())
            
            const dataMatch = !this.filtroData() || 
                              dataAula.includes(this.filtroData())

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

    // ==================== Ações da Tela ====================
    toggleDropdownTemporada() {
        this.dropdownTemporadaAberto = !this.dropdownTemporadaAberto
    }

    selecionarTemporada(temp: any) {
        this.temporada.set(temp)
        this.dropdownTemporadaAberto = false
        this.paginaAtual.set(1)
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
}