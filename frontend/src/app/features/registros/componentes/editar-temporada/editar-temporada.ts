import { Component, inject, EventEmitter, Output, Input, OnInit, HostListener, ElementRef, signal } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { EditarTemporadaModel } from '../../../../shared/models/temporada-models'

@Component({
  selector: 'app-editar-temporada',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './editar-temporada.html'
})
export class EditarTemporada implements OnInit {
    private elementRef = inject(ElementRef)

    @Output() fechar = new EventEmitter<void>() 
    @Output() salvar = new EventEmitter<any>()
    @Output() confirmarExclusao = new EventEmitter<number>() // Emite o ID direto para o Pai deletar de vez

    // Controla o pop-up de confirmação interna do modal
    mostrarConfirmacaoExcluir = signal<boolean>(false)

    // Recebe os dados vindo do Signal 'temporadaParaEditar' do componente Pai
    @Input() set dadosTemporada(dados: any | null | undefined) {
        if (dados) {
            this.formulario = {
                id: dados.id,
                nome: dados.nome,
                dataInicio: dados.dataInicio ? dados.dataInicio.substring(0,10) : '',
                dataFim: dados.dataFim ? dados.dataFim.substring(0, 10) : null
            }
        }
    }

    formulario = {
        id: 0,
        nome: '',
        dataInicio: '',
        dataFim: null as string | null
    }

    ngOnInit(): void {}

    @HostListener('document:click', ['$event'])
    cliqueFora(event: Event) {
        const alvo = event.target as HTMLElement
        // Se clicar nas ações do modal ou nos botões de exclusão, não fecha
        if (alvo.closest('button') || alvo.closest('.fechar-modal-btn') || alvo.closest('form')) {
        return
        }
        const clicouForaDoModal = !this.elementRef.nativeElement.contains(alvo)
        
        if (clicouForaDoModal && !this.mostrarConfirmacaoExcluir()) {
        this.fecharModal()
        }
    }

    fecharModal() {
        this.fechar.emit()
    }

    onSubmit() {
        const payload = {
            id: this.formulario.id,
            nome: this.formulario.nome,
            dataInicio: this.formulario.dataInicio,
            dataFim: this.formulario.dataFim ? this.formulario.dataFim : null
        }
        this.salvar.emit(payload)
    }

    abrirConfirmacaoExclusao() {
        this.mostrarConfirmacaoExcluir.set(true)
    }

    fecharConfirmacaoExclusao() {
        this.mostrarConfirmacaoExcluir.set(false)
    }

    executarExclusaoCompleta() {
        this.confirmarExclusao.emit(this.formulario.id)
        this.fecharConfirmacaoExclusao()
        this.fecharModal()
    }
}