import { Component, Input } from '@angular/core'
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


}