import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core'
import {  CommonModule } from '@angular/common'

@Component({
  selector: 'app-aluno-card',
  standalone: true,
  imports: [
     CommonModule
  ],
  templateUrl: './aluno-card.html'
})
export class AlunoCard {
  @Input() aluno!: any
  @Input() nomeCompleto = ''
  @Input() igreja = ''
  @Input() regiao = ''
  @Input() dataIngresso = ''
  @Input() grupo = ''
  @Input() frequenciaAtual = 0
  @Input() frequenciaMeta = 0
  @Input() atividadesAtual = 0
  @Input() atividadesMeta = 0
  @Output() editarAluno = new EventEmitter<any>()

  isMenuOpen = false

  toggleMenu(event: Event) {
    event.stopPropagation() // Evita fechar imediatamente pelo click do HostListener
    this.isMenuOpen = !this.isMenuOpen
  }

  onEdit() {
    this.isMenuOpen = false
    // Dispara o evento passando o objeto do aluno com os dados originais
    this.editarAluno.emit(this.aluno)
  }

  // Fecha o menu automaticamente se clicar em qualquer outro lugar da tela
  @HostListener('document:click')
  closeMenu() {
    this.isMenuOpen = false
  }

}