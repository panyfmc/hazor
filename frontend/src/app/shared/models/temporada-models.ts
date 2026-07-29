export interface Temporada {
  id: number
  nome: string
  dataInicio: string
  dataFim: string | null
}

export interface CriarTemporada {
  nome: string
  dataInicio: string
}

export interface EditarTemporadaModel {
  id: number
  nome: string
  dataInicio: string
  dataFim: string | null
}
