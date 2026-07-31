// 1. O Objeto completo que vem do Banco de Dados (Passado pelo Mapper.fromApi)
export interface Oficina {
  id: number
  temporadaId: number
  departamentoId: number
  dataAula: string
  teveAtividade: boolean
  totalPresentes: number
  presentes?: any[] // Sublista opcional com os registros de presença originais
}

// 2. O Contrato para Criar uma Oficina Nova
export interface CriarOficina {
  temporadaId: number
  departamentoId: number
  dataAula: string
  presentes: number[] // Array de IDs de alunos
  teveAtividade: boolean
}

// O 'Omit' remove o campo 'temporadaId' automaticamente para você não precisar redigitar os outros
export type AtualizarOficina = Omit<CriarOficina, 'temporadaId'>

// 4. O Contrato do Formulário dos Modais (onde o departamentoId pode começar como null/limpo)
export interface FormularioOficina {
  departamentoId: number | null
  dataAula: string
  presentes: number[]
  teveAtividade: boolean
}