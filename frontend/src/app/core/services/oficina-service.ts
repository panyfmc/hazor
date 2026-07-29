import { Injectable, inject } from '@angular/core'
import { HttpClient, HttpParams } from '@angular/common/http'

@Injectable ({
    providedIn: 'root'
})

export class OficinaService {
    private http = inject(HttpClient)
    private apiUrl =  'http://localhost:3000/oficinas'

    listarOficinas(temporadaId?: number) {
        let params = new HttpParams()
        if(temporadaId) {
            params = params.set('temporadaId', temporadaId.toString())
        }
        return this.http.get<any[]>(this.apiUrl, {params })
    }

    criarOficina(aula: any) {
        return this.http.post(this.apiUrl, aula) 
    }

    buscarPorId(id: number) {
        return this.http.get<any>(`${this.apiUrl}/${id}`)
    }

    atualizar(id: number, aula: any) {
        return this.http.put(`${this.apiUrl}/${id}`, aula)
    }

    excluir(id: number) {
        return this.http.delete(`${this.apiUrl}/${id}`)
    }

}


// router.get('/', aulaController.listar)

// router.post('/', aulaController.criar)

// router.get('/:id', aulaController.buscarPorId)

// router.put('/:id', aulaController.atualizar)

// router.delete('/:id', aulaController.excluir)