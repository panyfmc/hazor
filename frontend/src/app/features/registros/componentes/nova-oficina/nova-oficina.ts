import { Component, EventEmitter, Input, Output, computed, signal, HostListener } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'

export interface CriarOficina {
  dataAula: string
  departamentoId: number | null
  presentes: number[]
  teveAtividade: boolean
}

@Component({
  selector: 'app-nova-oficina',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './nova-oficina.html'
})

export class NovaOficina {
  @Output() fechar = new EventEmitter<void>()
  @Output() salvar = new EventEmitter<CriarOficina>()

  @Input() set alunos(valor: any[]) {
    this._alunos.set(valor ?? [])
  }
  get alunos() {
    return this._alunos()
  }
  private _alunos = signal<any[]>([])

  @Input() selecionados: number[] = []
  @Input() salvando = false
  @Input() sucesso = false

  formulario: CriarOficina = {
    dataAula: '',
    departamentoId: null,
    presentes: [],
    teveAtividade: false
  }

  pesquisa = signal('')

  departamentos = [
    { id: 1, nome: 'Fotografia' },
    { id: 2, nome: 'Produção' },
    { id: 3, nome: 'Design' }
  ]

  alunosFiltrados = computed(() => {
    const texto = this.pesquisa().trim().toLowerCase()
    return this.alunos.filter(aluno => aluno.nomeCompleto.toLowerCase().includes(texto))
  })

  dropdownDepartamentoAberto = false
  dropdownSeletorAberto = false

  toggleDropdownDepartamento() {
    this.dropdownDepartamentoAberto = !this.dropdownDepartamentoAberto
    if (this.dropdownDepartamentoAberto) {
      this.dropdownSeletorAberto = false
    }
  }

  toggleDropDownSeletor() {
    this.dropdownSeletorAberto = !this.dropdownSeletorAberto
    if (this.dropdownSeletorAberto) {
      this.dropdownDepartamentoAberto = false
    }
  }

  selecionarDepartamento(id: number | null) {
    this.formulario.departamentoId = id
    this.dropdownDepartamentoAberto = false
  }

  getDepartamentoSelecionadoNome(): string {
    if (this.formulario.departamentoId === null) {
      return 'Selecione'
    }
    const dept = this.departamentos.find(d => d.id === this.formulario.departamentoId)
    return dept ? dept.nome : 'Selecione'
  }

  alunoSelecionado(id: number) {
    return this.selecionados.includes(id)
  }

  toggleAluno(id: number) {
    if (this.alunoSelecionado(id)) {
      this.selecionados = this.selecionados.filter(x => x !== id)
    } else {
      this.selecionados = [...this.selecionados, id]
    }
    this.formulario.presentes = this.selecionados
  }

  selecionarTodos() {
    this.selecionados = this.alunos.map(a => a.id)
    this.formulario.presentes = this.selecionados
  }

  removerTodos() {
    this.selecionados = []
    this.formulario.presentes = []
  }

  // Fecha o dropdown se o usuário clicar fora dele
  @HostListener('document:click', ['$event'])
  cliqueFora(event: Event) {
    const alvo = event.target as HTMLElement

    if (alvo.closest('.relative')) {
      return
    }

    if (alvo.closest('button[type="submit"]') || alvo.closest('.fechar-modal-btn')) {
      return
    }

    this.dropdownDepartamentoAberto = false
    this.dropdownSeletorAberto = false
  }

  fecharModal() {
    this.fechar.emit()
  }

  onSubmit() {
    if (this.formulario.departamentoId === null) {
      return
    }

    this.salvar.emit(this.formulario)
  }
}