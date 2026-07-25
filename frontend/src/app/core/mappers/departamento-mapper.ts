import { Departamento } from "../../shared/models/departamento-models"

export class DepartamentoMapper {
  static fromApi(departamento: any): Departamento {
    return {
      id: departamento.Id,
      nome: departamento.Nome
    }
  }
}