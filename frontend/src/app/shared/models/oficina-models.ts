export interface Oficina {
  id: number
  temporadaId: number
  departamentoId: number
  dataAula: string
  teveAtividade: boolean
  totalPresentes: number
}

export interface CriarOficina {
  temporadaId: number
  departamentoId: number
  dataAula: string
  presentes: number[]
  teveAtividade: boolean
}

export interface AtualizarOficina {
  departamentoId: number
  dataAula: string
  teveAtividade: boolean
}

export interface FormularioOficina {
  departamentoId: number | null
  dataAula: string
  presentes: number[]
  teveAtividade: boolean
}