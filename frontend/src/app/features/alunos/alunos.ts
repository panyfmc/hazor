import { Component, OnInit, inject, signal } from '@angular/core'
import { AlunoCard } from './components/aluno-card/aluno-card'
import { Aluno } from '../../shared/models/aluno-models'
import { CadastroAluno } from './components/cadastro-aluno/cadastro-aluno'
import { AlunoService } from '../../core/services/aluno-service'

@Component({
  selector: 'app-alunos',
  standalone: true,
  imports: [
    AlunoCard,
    CadastroAluno
  ],
  templateUrl: './alunos.html'
})

export class Alunos implements OnInit { 
  mostrarModalCadastro = false 
  private alunoService = inject(AlunoService)
  alunos = signal<Aluno[]>([])

  ngOnInit(): void {
    this.carregarAlunos()
  }

  carregarAlunos() {

  this.alunoService.listar().subscribe({
    next: (dados: any[]) => {
      const mapeado = dados.map(aluno => ({
        id: aluno.Id,
        nomeCompleto: aluno.NomeCompleto,

        igreja: aluno.Igreja,

        regiao: aluno.Regiao,

        grupo: aluno.Grupo,

        dataIngresso: aluno.DataIngresso,

        frequenciaAtual: 0,
        frequenciaMeta: 6,

        atividadesAtual: 0,
        atividadesMeta: 6

      }))
      this.alunos.set(mapeado)
    },
    error: (erro) => {
      console.error(erro)
    }
  })

}
  
  abrirModal() {
    this.mostrarModalCadastro = true
  }

  fecharModal() {
    this.mostrarModalCadastro = false
  }

  cadastrarAluno(novoAluno: any) {
    this.alunoService.criar(novoAluno).subscribe({
      next: () => {
        this.carregarAlunos()
        this.fecharModal()
      },
      error: erro => {
        console.error(erro)
      }
    })
  }

}
