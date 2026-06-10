import { Component, OnInit, inject, signal, computed } from '@angular/core'
import { AlunoCard } from './components/aluno-card/aluno-card'
import { CadastroAluno } from './components/cadastro-aluno/cadastro-aluno'
import { EditarAluno } from './components/editar-aluno/editar-aluno'
import { FormsModule } from '@angular/forms'
import { AlunoMapper } from '../../core/mappers/aluno-mapper'
import { AlunoService } from '../../core/services/aluno-service'
import { RegiaoService } from '../../core/services/regiao-service' 
import { IgrejaService } from '../../core/services/igreja-service'
import { GrupoService } from '../../core/services/grupo-service'
import { GrupoMapper } from '../../core/mappers/grupo-mapper'
import { RegiaoMapper } from '../../core/mappers/regiao-mapper'
import { IgrejaMapper } from '../../core/mappers/igreja-mapper'

@Component({
  selector: 'app-alunos',
  standalone: true,
  imports: [
    AlunoCard,
    CadastroAluno,
    EditarAluno,
    FormsModule
  ],
  templateUrl: './alunos.html'
})
export class Alunos implements OnInit { 
  mostrarModalCadastro = false 
  mostrarModalEdicao = false 
  alunoParaEditar = signal<any>(null)

  // Injeções limpas
  private alunoService = inject(AlunoService)
  private regiaoService = inject(RegiaoService)
  private igrejaService = inject(IgrejaService)
  private grupoService = inject(GrupoService)

  alunos = signal<any[]>([]) 
  categoriaAtiva = signal<'todos' | 'oficina' | 'cpm' | 'midia'>('todos')
  termoPesquisa = signal<string>('')

  regioes = signal<any[]>([])
  igrejas = signal<any[]>([])
  grupos = signal<any[]>([])

  alunosFiltrados = computed(() => {
    const listaOriginal = this.alunos()
    const termo = this.termoPesquisa().trim().toLowerCase()
    const categoria = this.categoriaAtiva()

    return listaOriginal.filter(aluno => {
      if (aluno.ativo === false) return false

      const nome = aluno.nomeCompleto?.toLowerCase() || ''
      const igreja = aluno.igreja?.toLowerCase() || ''
      const regiao = aluno.regiao?.toLowerCase() || ''
      
      const passouNoTexto = !termo || nome.includes(termo) || igreja.includes(termo) || regiao.includes(termo)

      const grupo = aluno.grupo?.toLowerCase() || '' 
      let passouNaCategoria = false
      if (categoria === 'todos') {
        passouNaCategoria = true
      } else if (categoria === 'oficina') {
        passouNaCategoria = grupo.includes('oficina')
      } else if (categoria === 'cpm') {
        passouNaCategoria = grupo.includes('cpm')
      } else {
        passouNaCategoria = grupo.includes('mídia') || grupo.includes('midia')
      }
      return passouNoTexto && passouNaCategoria
    })
  })

  ngOnInit(): void {
    this.carregarAlunos()
    this.carregarDadosAuxiliares()
  }

  carregarDadosAuxiliares() {
    this.regiaoService.listar().subscribe(regioes => {
      this.regioes.set(
        regioes.map(RegiaoMapper.fromApi)
      )})

      this.grupoService.listar().subscribe(grupos => {
        this.grupos.set(
          grupos.map(GrupoMapper.fromApi)
        )
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

  prepararEdicao(aluno: any) {

    this.alunoParaEditar.set({
      id: aluno.id,
      nomeCompleto: aluno.nomeCompleto,
      regiaoId: aluno.regiaoId,
      igrejaId: aluno.igrejaId,
      grupoId: aluno.grupoId,
      dataIngresso: aluno.dataIngresso,
      ativo: aluno.ativo,
      dataInativacao: aluno.dataInativacao
    })

    this.mostrarModalEdicao = true

    this.igrejaService.listarPorRegiao(aluno.regiaoId).subscribe(igrejas => {
      this.igrejas.set(
        igrejas.map(IgrejaMapper.fromApi)
      )
    })

  }

  fecharModalEdicao() {
    this.mostrarModalEdicao = false
    this.alunoParaEditar.set(null)
  }

  salvarEdicao(alunoEditado: any) {
    this.alunoService.atualizar(alunoEditado.id, alunoEditado).subscribe({
      next: () => {
        this.carregarAlunos()
        this.fecharModalEdicao()
      },
      error: erro => console.error('Erro ao salvar edição:', erro)
    })
  }

  mudarCategoria(categoria: 'todos' | 'oficina' | 'cpm' | 'midia') { this.categoriaAtiva.set(categoria) }
  abrirModal() { this.mostrarModalCadastro = true }
  fecharModal() { this.mostrarModalCadastro = false }

  cadastrarAluno(novoAluno: any) {
    this.alunoService.criar(novoAluno).subscribe({
      next: () => {
        this.carregarAlunos()
        this.fecharModal()
      },
      error: erro => console.error(erro)
    })
  }
}