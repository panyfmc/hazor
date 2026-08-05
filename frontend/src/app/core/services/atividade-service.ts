import { Injectable, inject } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'

@Injectable ({
    providedIn: 'root'
})

export class AtividadeService {
    private http = inject(HttpClient)
    private apiUrl =  'http://localhost:3000/atividades'

    criarAtividade(atividade: any) {
        return this.http.post(this.apiUrl, atividade) 
    }

    buscarPorOficina(oficinaId: number) {
        return this.http.get<any>(`${this.apiUrl}/oficina/${oficinaId}`)
    }

    encerrarAtividade(atividadeId: number): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${atividadeId}/encerrar`, {})
    }

    excluir(id: number) {
        return this.http.delete(`${this.apiUrl}/${id}`)
    }

}

// router.post('/', controller.criar)
// router.get('/oficina/:oficinaId', controller.buscarPorOficina)
// router.patch('/:id/encerrar', controller.encerrar)
// router.delete('/:id', controller.excluir)

// router.post('/:atividadeId/entregas', controller.criarEntrega)
// router.get('/:atividadeId/entregas', controller.listarPorAtividade)
// router.put('/:atividadeId/entregas', controller.editarEntregas)
// router.delete('/:atividadeId/entregas/:alunoId', controller.removerEntrega)
