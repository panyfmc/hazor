import { Regiao } from "../../shared/models/regiao-model"

export class RegiaoMapper {
  static fromApi(regiao: any): Regiao {
    return {
      id: regiao.Id,
      nome: regiao.Nome
    }
  }
}