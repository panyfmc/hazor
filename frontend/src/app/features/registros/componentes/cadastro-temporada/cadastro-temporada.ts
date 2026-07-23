import { Component, EventEmitter, Output, OnInit, inject, HostListener, ElementRef } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'

export interface CriarTemporada {
  nome: string
  dataInicio: string
}

@Component({
  selector: 'app-cadastro-temporada',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './cadastro-temporada.html'
})


export class NovaTemporada implements OnInit {
    private elementRef = inject(ElementRef)
    @Output() fechar = new EventEmitter<void>() 
    @Output() salvar = new EventEmitter<CriarTemporada>()

    ngOnInit(): void {
        
    }

    // Opcional: Fechar o dropdown se o usuário clicar fora dele
    @HostListener('document:click', ['$event'])
    cliqueFora(event: Event) {
        const alvo = event.target as HTMLElement

        if (alvo.closest('button[type="submit"]') || alvo.closest('.fechar-modal-btn')) {
            return
        }
        const clicouForaDoModal = !this.elementRef.nativeElement.contains(alvo)
        
        if (clicouForaDoModal) {
            this.fecharModal()
        }
        
    }

    formulario: CriarTemporada = {
        nome: '',
        dataInicio: ''
    }

    fecharModal() {
        this.fechar.emit()
    }

    onSubmit() {

        const temporada: CriarTemporada = {

        nome: this.formulario.nome,
        dataInicio: this.formulario.dataInicio

        }

        this.salvar.emit(temporada)
        this.fecharModal()
    }
}