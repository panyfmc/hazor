import { Oficina, CriarOficina, AtualizarOficina } from '../../shared/models/oficina-models'

export class OficinaMapper {
  static fromApi(aula: any): Oficina {
    return {
      id: aula.Id,
      temporadaId: aula.TemporadaId,
      departamentoId: aula.DepartamentoId,
      dataAula: aula.DataAula,
      teveAtividade: aula.TeveAtividade,
      totalPresentes: aula.TotalPresentes
    }
  }

  static toCriarApi(oficina: CriarOficina): any {
    return {
      TemporadaId: oficina.temporadaId,
      DepartamentoId: oficina.departamentoId,
      DataAula: oficina.dataAula,
      Presentes: oficina.presentes, // Array de IDs de alunos presentes
      TeveAtividade: oficina.teveAtividade
    }
  }

  static toAtualizarApi(oficina: any): any {
    return {
      DepartamentoId: oficina.departamentoId,
      DataAula: oficina.dataAula,
      TeveAtividade: oficina.teveAtividade,
      Presentes: oficina.presentes
    }
  }
}