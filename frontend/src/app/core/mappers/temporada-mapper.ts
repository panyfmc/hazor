import { Temporada } from "../../shared/models/temporada-models"

export class TemporadaMapper {
    static fromApi(temp: any): Temporada {
        return {
            id: temp.Id,
            nome: temp.Nome,
            dataInicio: temp.DataInicio,
            dataFim: temp.DataFim
        }
    }
 }