import { Injectable, inject } from '@angular/core'
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class IgrejaService {

  private http = inject(HttpClient)

  listarPorRegiao(regiaoId: number) {
    return this.http.get<any[]>(`http://localhost:3000/api/igrejas/regiao/${regiaoId}`)
  }

}