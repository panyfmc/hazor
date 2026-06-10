import { Grupo } from "../../shared/models/grupo-model"

export class GrupoMapper {
  static fromApi(grupo: any): Grupo {
    return {
      id: grupo.Id,
      nome: grupo.Nome
    }
  }
}