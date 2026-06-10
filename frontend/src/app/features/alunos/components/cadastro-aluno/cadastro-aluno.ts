import { Component, EventEmitter, Output, OnInit, inject, HostListener } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { RegiaoService } from '../../../../core/services/regiao-service'
import { IgrejaService } from '../../../../core/services/igreja-service'
import { GrupoService } from '../../../../core/services/grupo-service'
import { CriarAluno, CadastroAlunoForm } from '../../../../shared/models/aluno-models'
import { Regiao } from '../../../../shared/models/regiao-model'
import { Igreja } from '../../../../shared/models/igreja-model'
import { Grupo } from '../../../../shared/models/grupo-model'


@Component({
  selector: 'app-cadastro-aluno',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './cadastro-aluno.html'
})

export class CadastroAluno implements OnInit {
  private regiaoService = inject(RegiaoService)
  private igrejaService = inject(IgrejaService)
  private grupoService = inject(GrupoService)

  formulario: CadastroAlunoForm = {
    nomeCompleto: '',
    regiaoId: null,
    igrejaId: null,
    grupoId: null,
    dataIngresso: ''
  }

  @Output() fechar = new EventEmitter<void>()
  @Output() salvar = new EventEmitter<CriarAluno>()

  regioes: Regiao[] = []
  igrejas: Igreja[] = []
  grupos: Grupo[] = []

  ngOnInit() {
    this.carregarRegioes()
    this.carregarGrupos()
  }
  carregarRegioes() {
    this.regiaoService.listar().subscribe(regioes => {
      this.regioes = regioes.map(r => ({
        id: r.Id,
        nome: r.Nome
      }))
    })
  }

  carregarGrupos() {
    this.grupoService.listar().subscribe(grupos => {
      this.grupos = grupos.map(g => ({
        id: g.Id,
        nome: g.Nome
      }))
    })
  }

  carregarIgrejas() {
    if (this.formulario.regiaoId === null) {
      this.igrejas = []
      return
    }
    this.igrejaService.listarPorRegiao(this.formulario.regiaoId).subscribe(igrejas => {
      this.igrejas = igrejas.map(i => ({
        id: i.Id,
        nome: i.Nome
      }))
    })
  }

  dropdownRegiaoAberto = false
  dropdownIgrejaAberto = false
  dropdownGrupoAberto = false

  toggleDropdownRegiao() {
    this.dropdownRegiaoAberto = !this.dropdownRegiaoAberto
    if(this.dropdownRegiaoAberto) {
      this.dropdownIgrejaAberto = false
      this.dropdownGrupoAberto = false
    } 
  }

  toggleDropdownIgreja() {
    this.dropdownIgrejaAberto = !this.dropdownIgrejaAberto
    if(this.dropdownIgrejaAberto) {
      this.dropdownRegiaoAberto = false
      this.dropdownGrupoAberto = false
    } 
  }

  toggleDropdownGrupo() {
    this.dropdownGrupoAberto = !this.dropdownGrupoAberto
    if (this.dropdownGrupoAberto) {
      this.dropdownRegiaoAberto = false
      this.dropdownIgrejaAberto = false
    }
}

  selecionarRegiao(id: number) {
    this.formulario.regiaoId = id
    this.dropdownRegiaoAberto = false
    this.carregarIgrejas() // Dispara sua função existente
  }

  selecionarIgreja(id: number | null) {
    this.formulario.igrejaId = id
    this.dropdownIgrejaAberto = false
  }

  selecionarGrupo(id: number | null) {
    this.formulario.grupoId = id
    this.dropdownGrupoAberto = false
  }

  getRegiaoSelecionadaNome(): string {
    if (!this.formulario.regiaoId || this.formulario.regiaoId === 0) {
      return 'Selecione uma região'
    }
    const regiao = this.regioes.find(r => r.id === this.formulario.regiaoId)
    return regiao ? regiao.nome : 'Selecione uma região'
  }

  getIgrejaSelecionadaNome(): string {
    if (this.formulario.igrejaId === null || this.formulario.igrejaId === undefined) {
      return 'Selecione uma igreja'
    }
    const igreja = this.igrejas?.find(i => i.id === this.formulario.igrejaId)
    return igreja ? igreja.nome : 'Selecione uma igreja'
  }

  getGrupoSelecionadaNome(): string {
    if (this.formulario.grupoId === null || this.formulario.grupoId === undefined) {
      return 'Selecione'
    }
    const grupo = this.grupos?.find(g => g.id === this.formulario.grupoId)
    return grupo ? grupo.nome : 'Selecione'
  }

  // Opcional: Fechar o dropdown se o usuário clicar fora dele
  @HostListener('document:click', ['$event'])
  cliqueFora(event: Event) {
    const alvo = event.target as HTMLElement

    if (alvo.closest('.relative')) {
      return
    }

    if (alvo.closest('button[type="submit"]') || alvo.closest('.fechar-modal-btn')) {
      return
    }
    
    this.dropdownRegiaoAberto = false
    this.dropdownIgrejaAberto = false
    this.dropdownGrupoAberto = false
  }

  

  fecharModal() {
    this.fechar.emit()
  }

  onSubmit() {

    if (
      this.formulario.igrejaId === null ||
      this.formulario.grupoId === null
    ) {
      return
    }

    const aluno: CriarAluno = {

      nomeCompleto: this.formulario.nomeCompleto,

      igrejaId: this.formulario.igrejaId,

      grupoId: this.formulario.grupoId,

      dataIngresso: this.formulario.dataIngresso

    }

    this.salvar.emit(aluno)
    this.fecharModal()
  }
}