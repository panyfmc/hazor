export interface CriarTemporada {
  nome: string
  dataInicio: string
}

export interface EditarTemporada {
  id: number
  nome: string
  dataInicio: string
  dataFim: string | null
}
