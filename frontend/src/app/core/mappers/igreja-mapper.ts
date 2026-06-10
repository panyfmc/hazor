import { Igreja } from "../../shared/models/igreja-model"

export class IgrejaMapper {
  static fromApi(igreja: any): Igreja {
    return {
      id: igreja.Id,
      nome: igreja.Nome
    }
  }
}