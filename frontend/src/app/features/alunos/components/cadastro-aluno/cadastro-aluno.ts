import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Aluno } from '../../models/aluno-models';

@Component({
  selector: 'app-cadastro-aluno',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cadastro-aluno.html'
})
export class CadastroAluno {
  @Output() fechar = new EventEmitter<void>();
  @Output() salvar = new EventEmitter<Aluno>();

  // Inicializa o objeto com valores padrão baseados na sua Interface
  novoAluno: Aluno = {
    nome: '',
    igreja: '',
    regiao: '',
    dataIngresso: new Date(),
    frequenciaAtual: 0,
    frequenciaMeta: 100, // Valor padrão lógico
    atividadesAtual: 0,
    atividadesMeta: 10,  // Valor padrão lógico
    grupo: 'OFICINA'
  };

  fecharModal() {
    this.fechar.emit();
  }

  onSubmit() {
    // Garante que a data está no formato correto antes de enviar
    this.novoAluno.dataIngresso = new Date(this.novoAluno.dataIngresso);
    this.salvar.emit(this.novoAluno);
  }
}