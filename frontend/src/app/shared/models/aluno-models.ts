export interface Aluno {
  id: number
  nomeCompleto: string
  igreja: string
  regiao: string
  grupo: string
  dataIngresso: string
  ativo: boolean
  dataInativacao?: string | null

  frequenciaAtual?: number
  frequenciaMeta?: number
  atividadesAtual?: number
  atividadesMeta?: number
}

export interface CriarAluno {
  nomeCompleto: string
  igrejaId: number
  grupoId: number
  dataIngresso: string
}

export interface CadastroAlunoForm {
  nomeCompleto: string
  regiaoId: number | null
  igrejaId: number | null
  grupoId: number | null
  dataIngresso: string
}

export interface EditarAluno {
  nomeCompleto: string
  igrejaId: number | null
  regiaoId: number | null
  grupoId: number | null
  dataIngresso: string
  ativo: boolean
  dataInativacao?: string | null
}