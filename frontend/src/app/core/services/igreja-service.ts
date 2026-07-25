import { Injectable, inject } from '@angular/core'
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class IgrejaService {

  private http = inject(HttpClient)
  private apiUrl = 'http://localhost:3000/igrejas/regiao'

  listarPorRegiao(regiaoId: number) {
    return this.http.get<any[]>(`${this.apiUrl}/${regiaoId}`)
  }

}