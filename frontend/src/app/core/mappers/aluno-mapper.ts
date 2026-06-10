import { Aluno } from "../../shared/models/aluno-models"

export class AlunoMapper {

  static fromApi(aluno: any): Aluno {

    return {
      id: aluno.Id,
      nomeCompleto: aluno.NomeCompleto,
      igreja: aluno.Igreja,
      regiao: aluno.Regiao,
      grupo: aluno.Grupo,
      dataIngresso: aluno.DataIngresso,
      ativo: aluno.Ativo,
      dataInativacao: aluno.DataInativacao,
      regiaoId: aluno.RegiaoId,
      igrejaId: aluno.IgrejaId,
      grupoId: aluno.GrupoId,
      frequenciaAtual: 0,
      frequenciaMeta: 6,
      atividadesAtual: 0,
      atividadesMeta: 6
    }

  }

}