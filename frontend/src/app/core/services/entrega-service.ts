import { Injectable, inject } from '@angular/core'
import { HttpClient } from '@angular/common/http'


@Injectable ({
    providedIn: 'root'
})

export class EntregaService {
    private http = inject(HttpClient)
    private apiUrl =  'http://localhost:3000/atividades'

    criarEntrega(atividadeId: number) {
        return this.http.post<any>(`${this.apiUrl}/${atividadeId}/entregas`, {}) 
    }

    entregas(atividadeId: number) {
        return this.http.get<any>(`${this.apiUrl}/${atividadeId}/entregas`)
    }

    editarEntregas(atividadeId: number) {
    return this.http.put<any>(`${this.apiUrl}/${atividadeId}/entregas`, {})
    }

    excluirEntrega(id: number, alunoId: number) {
        return this.http.delete(`${this.apiUrl}/${id}/entregas/${alunoId}`)
    }


}

// router.post('/:atividadeId/entregas', controller.criarEntrega)
// router.get('/:atividadeId/entregas', controller.listarPorAtividade)
// router.put('/:atividadeId/entregas', controller.editarEntregas)
// router.delete('/:atividadeId/entregas/:alunoId', controller.removerEntrega)
