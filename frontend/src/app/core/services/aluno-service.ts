import { Injectable, inject } from '@angular/core'
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})

export class AlunoService {
  private http = inject(HttpClient)

  private apiUrl = 'http://localhost:3000/api/alunos'

  listar() {
    return this.http.get<any[]>(this.apiUrl)
  }

  criar(aluno: any) {
    return this.http.post(this.apiUrl, aluno)
  }

  atualizar(id: number, aluno: any) {
    return this.http.put(`${this.apiUrl}/${id}`, aluno)
  }
}