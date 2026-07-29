import { Component, Input, Output, EventEmitter, inject, signal, computed, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { AlunoService } from '../../../../core/services/aluno-service'
import { DepartamentoService } from '../../../../core/services/departamento-service'
import { DepartamentoMapper } from '../../../../core/mappers/departamento-mapper'
import { Departamento } from '../../../../shared/models/departamento-models'

export interface EditarOficinaForm {
  id: number
  dataAula: string
  departamentoId: number | null
  teveAtividade: boolean
}

@Component({
  selector: 'app-editar-oficina',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './editar-oficina.html'
})
export class EditarOficina implements OnInit {
  private alunoService = inject(AlunoService)
  private departamentoService = inject(DepartamentoService)
  departamentos: Departamento[] = []
  alunos: any[] = []
  selecionados: number[] = []
  pesquisa = signal('')
  dropdownDepartamentoAberto = false
  dropdownSeletorAberto = false
  salvando = false
  @Output() fechar = new EventEmitter<void>()
  @Output() salvar = new EventEmitter<any>()
  
  ngOnInit() {
    this.carregarAlunos()
  }
  
  @Input() set oficina(dados: any) {
    if (!dados) return

    this.formulario = {
      id: dados.Id || 0,
      dataAula: dados.DataAula ? dados.DataAula.substring(0, 10) : '',
      departamentoId: dados.DepartamentoId || null,
      teveAtividade: dados.TeveAtividade ?? true
    }

    // Carrega alunos já presentes
    if (dados.presentes?.length) {
      this.selecionados = dados.presentes.map((p: any) => p.AlunoId)
    }
  }

  formulario: EditarOficinaForm = {
    id: 0,
    dataAula: '',
    departamentoId: null,
    teveAtividade: true
  }

  carregarDepartamentos() {
    this.departamentoService.listar().subscribe(departamentos => {
      this.departamentos = departamentos.map(DepartamentoMapper.fromApi)
    })
  }


  carregarAlunos() {
    this.alunoService.listar().subscribe({
      next: (res) => {
        this.alunos = res.map((a: any) => ({
          id: a.Id,
          nomeCompleto: a.NomeCompleto
        }))
      },
      error: (err) => console.error('Erro ao carregar alunos:', err)
    })
  }

  // Computed para filtro
  alunosFiltrados = computed(() => {
    const termo = this.pesquisa().toLowerCase().trim()
    if (!termo) return this.alunos
    return this.alunos.filter(a => a.nomeCompleto.toLowerCase().includes(termo))
  })

  trackById(index: number, aluno: any): number {
    return aluno.id
  }

  // ==================== Dropdown Departamento ====================
  toggleDropdownDepartamento() {
    this.dropdownDepartamentoAberto = !this.dropdownDepartamentoAberto
  }

  selecionarDepartamento(id: number | null) {
    this.formulario.departamentoId = id
    this.dropdownDepartamentoAberto = false
  }

  getDepartamentoSelecionadaNome(): string {
    return this.departamentos.find(d => d.id === this.formulario.departamentoId)?.nome ?? 'Selecione'
  }

  // ==================== Seleção de Alunos ====================
  toggleDropDownSeletor() {
    this.dropdownSeletorAberto = !this.dropdownSeletorAberto
  }

  toggleAluno(id: number) {
    if (this.selecionados.includes(id)) {
      this.selecionados = this.selecionados.filter(x => x !== id)
    } else {
      this.selecionados = [...this.selecionados, id]
    }
  }

  alunoSelecionado(id: number): boolean {
    return this.selecionados.includes(id)
  }

  selecionarTodos() {
    this.selecionados = this.alunos.map(a => a.id)
  }

  removerTodos() {
    this.selecionados = []
  }

  // ==================== Submit ====================
  onSubmit() {
    if (this.salvando) return

    this.salvando = true

    const dados = {
      id: this.formulario.id,
      departamentoId: this.formulario.departamentoId,
      dataAula: this.formulario.dataAula,
      teveAtividade: this.formulario.teveAtividade,
      presentes: [...this.selecionados]        // Nome esperado pelo backend
    }

    console.log('📤 ENVIANDO:', dados)
    this.salvar.emit(dados)
    this.fecharModal()
  }

  fecharModal() {
    console.log("fewcha m")
    this.fechar.emit()
  }
}