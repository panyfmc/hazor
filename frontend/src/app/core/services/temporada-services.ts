import { Injectable, inject } from '@angular/core'
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class temporadaService {
  private http = inject(HttpClient)
  private apiUrl =  'http://localhost:3000/temporadas'

    listarTemporadas() {
        return this.http.get<any[]>(this.apiUrl)
    }

    criarTemporada(temporada: any) {
        return this.http.post(this.apiUrl, temporada)
    }

    buscarTemporadaAtiva() {
        return this.http.get<any>(`${this.apiUrl}/ativa`)
    }

    ativarTemporada(id: number) {
        return this.http.patch(`${this.apiUrl}/${id}/ativar`, {})
    }

    excluirTemporada(id: number) {
        return this.http.delete(`${this.apiUrl}/${id}`)
    }

}