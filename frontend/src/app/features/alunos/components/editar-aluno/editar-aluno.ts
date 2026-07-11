import { Component, Input, Output, EventEmitter, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { IgrejaService } from '../../../../core/services/igreja-service'
import { Regiao } from '../../../../shared/models/regiao-model'
import { Grupo } from '../../../../shared/models/grupo-model'
import { Igreja } from '../../../../shared/models/igreja-model'
import { EditarAlunoForm } from '../../../../shared/models/aluno-models'
import { IgrejaMapper } from '../../../../core/mappers/igreja-mapper'

@Component({
  selector: 'app-editar-aluno',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './editar-aluno.html'
})
export class EditarAluno {
  private igrejaService = inject(IgrejaService)

  @Input() set aluno(dados: any) {
    if (!dados) return
    this.formulario = {
      id: dados.id,
      nomeCompleto: dados.nomeCompleto,
      regiaoId: dados.regiaoId,
      igrejaId: dados.igrejaId,
      grupoId: dados.grupoId,
      dataIngresso: dados.dataIngresso ? dados.dataIngresso.substring(0,10) : '',
      ativo: dados.ativo,
      dataInativacao: dados.dataInativacao ? dados.dataInativacao.substring(0,10) : ''
    }

  }

  @Input() regioes: Regiao[] = []
  @Input() igrejas: Igreja[] = []
  @Input() grupos: Grupo[] = []

  @Output() fechar = new EventEmitter<void>()
  @Output() salvar = new EventEmitter<any>()

  
  formulario: EditarAlunoForm = {
    id: 0,
    nomeCompleto: '',
    regiaoId: null,
    igrejaId: null,
    grupoId: null,
    dataIngresso: '',
    ativo: true,
    dataInativacao: ''
  }

  // Estados de controle dos dropdowns customizados
  dropdownRegiaoAberto = false
  dropdownIgrejaAberto = false
  dropdownGrupoAberto = false

  toggleDropdownRegiao() { this.dropdownRegiaoAberto = !this.dropdownRegiaoAberto }
  toggleDropdownIgreja() { this.dropdownIgrejaAberto = !this.dropdownIgrejaAberto }
  toggleDropdownGrupo() { this.dropdownGrupoAberto = !this.dropdownGrupoAberto }

  selecionarRegiao(id: number) {
    this.formulario.regiaoId = id
    this.formulario.igrejaId = null // Reseta a igreja se mudar a região
    this.dropdownRegiaoAberto = false
    this.carregarIgrejas()
  }

  selecionarIgreja(id: number | null) {
    this.formulario.igrejaId = id
    this.dropdownIgrejaAberto = false
  }

  selecionarGrupo(id: number | null) {
    this.formulario.grupoId = id
    this.dropdownGrupoAberto = false
  }

  // Métodos auxiliares para pegar o rótulo atual do botão
  getRegiaoSelecionadaNome(): string {
    const regiao = this.regioes.find(r => r.id === this.formulario.regiaoId)
    return regiao ? regiao.nome : 'Selecione uma região'
  }

  getIgrejaSelecionadaNome(): string {
    const igreja = this.igrejas.find(i => i.id === this.formulario.igrejaId)
    return igreja && this.formulario.igrejaId ? igreja.nome : 'Selecione uma igreja'
  }

  getGrupoSelecionadaNome(): string {
    const grupo = this.grupos.find(g => g.id === this.formulario.grupoId)
    return grupo && this.formulario.grupoId ? grupo.nome : 'Selecione'
  }

  carregarIgrejas() {
    if(!this.formulario.regiaoId) {
      this.igrejas=[]
      return
    }
    this.igrejaService.listarPorRegiao(this.formulario.regiaoId).subscribe(igrejas=> {
      this.igrejas = igrejas.map(IgrejaMapper.fromApi)
    })
  }

  // Lógica disparada ao interagir com o checkbox de Ativo
  onAtivoChange() {
    if (this.formulario.ativo) {
      this.formulario.dataInativacao = '' // Limpa a data se voltar a ser ativo
    } else {
      // Define a data de hoje como padrão ao inativar (formato yyyy-MM-dd)
      this.formulario.dataInativacao = new Date().toISOString().split('T')[0]
    }
  }

  fecharModal() {
    this.fechar.emit()
  }

  onSubmit() {
    this.salvar.emit(this.formulario)
  }
}