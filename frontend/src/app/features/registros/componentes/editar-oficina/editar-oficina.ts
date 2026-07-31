import { Component, inject, EventEmitter, Output, Input, OnInit, HostListener, ElementRef, signal, computed } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { AlunoService } from '../../../../core/services/aluno-service'
import { DepartamentoService } from '../../../../core/services/departamento-service'
import { DepartamentoMapper } from '../../../../core/mappers/departamento-mapper'
import { OficinaMapper } from '../../../../core/mappers/oficina-mapper'
import { Departamento } from '../../../../shared/models/departamento-models'
import { FormularioOficina } from '../../../../shared/models/oficina-models'
import { AlunoMapper } from '../../../../core/mappers/aluno-mapper'

@Component({
  selector: 'app-editar-oficina',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './editar-oficina.html'
})
export class EditarOficina implements OnInit {
  private elementRef = inject(ElementRef)
  private alunoService = inject(AlunoService)
  private departamentoService = inject(DepartamentoService)

  @Output() fechar = new EventEmitter<void>()
  @Output() salvar = new EventEmitter<any>()
  @Output() confirmarExclusaoOficina = new EventEmitter<number>()

  // 🌟 MODIFICADO: Transformados em Signals para garantir reatividade instantânea
  departamentos = signal<Departamento[]>([])
  alunos = signal<any[]>([])
  carregandoAlunos = signal(true)
  selecionados = signal<number[]>([])
  pesquisa = signal('')
  dropdownDepartamentoAberto = false
  dropdownSeletorAberto = false
  salvando = false
  mostrarConfirmacaoExcluir = signal<boolean>(false)

  idOficina = 0

  formulario: FormularioOficina = {
    dataAula: '',
    departamentoId: null,
    presentes: [],
    teveAtividade: true
  }

  ngOnInit(): void {
    this.carregarAlunos()
    this.carregarDepartamentos()
  }

  @Input() set oficina(dados: any | null | undefined) {
    if (!dados) return

    this.idOficina = dados.id || 0

    this.formulario = {
      dataAula: dados.dataAula ? dados.dataAula.substring(0, 10) : '',
      departamentoId: dados.departamentoId || null,
      teveAtividade: dados.teveAtividade ?? true,
      presentes: []
    }

    // Vincula os alunos presentes
    if (dados.presentes?.length) {
      // Mapeia suportando tanto objetos com AlunoId/alunoId quanto número puro
      const idsPresentes = dados.presentes.map((p: any) => p.alunoId || p.AlunoId || p)
      this.selecionados.set(idsPresentes)
      this.formulario.presentes = idsPresentes
    } else {
      this.selecionados.set([])
      this.formulario.presentes = []
    }
  }

  @HostListener('document:click', ['$event'])
  cliqueFora(event: Event) {
    const alvo = event.target as HTMLElement
    if (alvo.closest('button') || alvo.closest('.fechar-modal-btn') || alvo.closest('form') || alvo.closest('.dropdown-content')) {
      return
    }
    const clicouForaDoModal = !this.elementRef.nativeElement.contains(alvo)
    if (clicouForaDoModal && !this.mostrarConfirmacaoExcluir()) {
      this.fecharModal()
    }
  }

  // ==================== Carregamento de Dados ====================
  carregarDepartamentos() {
    this.departamentoService.listar().subscribe(deps => {
      // 🌟 MODIFICADO: Atualiza usando o .set() do Signal
      this.departamentos.set(deps.map(DepartamentoMapper.fromApi))
      
      // Acorda o formulário recriando a referência caso o ID já estivesse setado
      if (this.formulario.departamentoId) {
        this.formulario = { ...this.formulario }
      }
    })
  }

  carregarAlunos() {
    this.carregandoAlunos.set(true)
    this.alunoService.listar().subscribe({
      next: (dados: any[]) => {
        const mapeado = dados.map(AlunoMapper.fromApi)
        this.alunos.set(mapeado) 
        this.carregandoAlunos.set(false)
      },
      error: (erro) => console.error(erro)
    })
  }

  // ==================== Filtros e Computeds ====================
  // 🌟 MODIFICADO: Agora o computed rastreia tanto o Signal da pesquisa quanto o Signal de alunos
  alunosFiltrados = computed(() => {
    const listaAlunos = this.alunos()
    const termo = this.pesquisa().toLowerCase().trim()
    if (!termo) return listaAlunos
    return listaAlunos.filter(a => a.nomeCompleto.toLowerCase().includes(termo))
  })

  // ==================== Dropdown Departamento ====================
  toggleDropdownDepartamento() {
    this.dropdownDepartamentoAberto = !this.dropdownDepartamentoAberto
  }

  selecionarDepartamento(id: number | null) {
    this.formulario.departamentoId = id
    this.dropdownDepartamentoAberto = false
  }

  getDepartamentoSelecionado(): string {
    // 🌟 MODIFICADO: Lendo a lista de departamentos como função: this.departamentos()
    return this.departamentos().find(d => d.id === this.formulario.departamentoId)?.nome ?? 'Selecione'
  }

  // ==================== Seleção de Alunos ====================
  toggleDropDownSeletor() {
    this.dropdownSeletorAberto = !this.dropdownSeletorAberto
  }

  toggleAluno(id: number) {
    const atuais = this.selecionados()
    if (atuais.includes(id)) {
      this.selecionados.set(atuais.filter(x => x !== id))
    } else {
      this.selecionados.set([...atuais, id])
    }
    this.formulario.presentes = this.selecionados()
  }

  alunoSelecionado(id: number): boolean {
    return this.selecionados().includes(id)
  }

  selecionarTodos() {
    // 🌟 MODIFICADO: Acessa os alunos com a função this.alunos()
    const todosIds = this.alunos().map(a => a.id)
    this.selecionados.set(todosIds)
    this.formulario.presentes = todosIds
  }

  removerTodos() {
    this.selecionados.set([])
    this.formulario.presentes = []
  }

  // ==================== Controle de Modais e Submissão ====================
  fecharModal() {
    this.fechar.emit()
    this.salvando = false
  }

  onSubmit() {
    if (this.salvando || this.formulario.departamentoId === null) return

    this.salvando = true

    const dadosForm = {
      departamentoId: this.formulario.departamentoId,
      dataAula: this.formulario.dataAula,
      teveAtividade: this.formulario.teveAtividade,
      presentes: this.selecionados()
    }

    const payload = OficinaMapper.toAtualizarApi(dadosForm)
    
    this.salvar.emit({ id: this.idOficina, ...payload })
    this.fecharModal()
  }

  abrirConfirmacaoExclusao() {
    this.mostrarConfirmacaoExcluir.set(true)
  }

  fecharConfirmacaoExclusao() {
    this.mostrarConfirmacaoExcluir.set(false)
  }

  executarExclusaoCompleta() {
    this.confirmarExclusaoOficina.emit(this.idOficina)
    this.fecharConfirmacaoExclusao()
    this.fecharModal()
  }
}