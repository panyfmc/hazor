import { Injectable, inject } from '@angular/core'
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class RegiaoService {

  private http = inject(HttpClient)

  listar() {
    return this.http.get<any[]>('http://localhost:3000/regioes')
  }

}