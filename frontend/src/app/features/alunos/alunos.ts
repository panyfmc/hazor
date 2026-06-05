import { Component, OnInit, inject, signal, computed } from '@angular/core'
import { AlunoCard } from './components/aluno-card/aluno-card'
import { Aluno } from '../../shared/models/aluno-models'
import { CadastroAluno } from './components/cadastro-aluno/cadastro-aluno'
import { AlunoService } from '../../core/services/aluno-service'
import { FormsModule } from '@angular/forms'

@Component({
  selector: 'app-alunos',
  standalone: true,
  imports: [
    AlunoCard,
    CadastroAluno,
    FormsModule
  ],
  templateUrl: './alunos.html'
})

export class Alunos implements OnInit { 
  mostrarModalCadastro = false 
  private alunoService = inject(AlunoService)
  alunos = signal<any[]>([]) 
  categoriaAtiva = signal<'todos' | 'oficina' | 'midia'>('todos')
  termoPesquisa = signal<string>('')


  alunosFiltrados = computed(() => {
    const listaOriginal = this.alunos()
    const termo = this.termoPesquisa().trim().toLowerCase()
    const categoria = this.categoriaAtiva()

    return listaOriginal.filter(aluno => {
      // ---- PASSO 1: Filtrar por Texto ----
      const nome = aluno.nomeCompleto?.toLowerCase() || ''
      const igreja = aluno.igreja?.toLowerCase() || ''
      const regiao = aluno.regiao?.toLowerCase() || ''
      
      const passouNoTexto = !termo || nome.includes(termo) || igreja.includes(termo) || regiao.includes(termo)

      // ---- PASSO 2: Filtrar pelos Botões ----
      const grupo = aluno.grupo?.toLowerCase() || '' 
      
      let passouNaCategoria = false
      if (categoria === 'todos') {
        passouNaCategoria = true
      } else if (categoria === 'oficina') {
        passouNaCategoria = grupo.includes('oficina')
      } else if (categoria === 'midia') {
        passouNaCategoria = grupo.includes('mídia') || grupo.includes('midia')
      }
      return passouNoTexto && passouNaCategoria
    })
  })

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
        
        // avisa o Angular AUTOMATICAMENTE que há dados novos
        this.alunos.set(mapeado) 
      },
      error: (erro) => {
        console.error(erro)
      }
    })
  }

  mudarCategoria(categoria: 'todos' | 'oficina' | 'midia') {
    this.categoriaAtiva.set(categoria)
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