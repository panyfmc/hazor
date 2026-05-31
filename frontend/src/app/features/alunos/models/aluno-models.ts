export interface Aluno {

  nome: string;

  igreja: string;

  regiao: string;

  dataIngresso: Date;

  frequenciaAtual: number;
  frequenciaMeta: number;

  atividadesAtual: number;
  atividadesMeta: number;

  grupo: 'OFICINA' | 'MÍDIA';
}