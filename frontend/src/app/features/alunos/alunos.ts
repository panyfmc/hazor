import { Component } from '@angular/core';
import { AlunoCard } from './components/aluno-card/aluno-card';
import { Aluno } from './models/aluno-models';
import { CadastroAluno } from './components/cadastro-aluno/cadastro-aluno';

@Component({
  selector: 'app-alunos',
  standalone: true,
  imports: [
    AlunoCard,
    CadastroAluno
  ],
  templateUrl: './alunos.html'
})

export class Alunos { // Mantive o nome "Alunos" que é o que o seu DashboardLayout está tentando importar!
  mostrarModalCadastro = false; // Controle do Pop-up

  // Seus dados mockados unificados aqui dentro da classe principal!
  alunos: Aluno[] = [
    {
      nome: 'joao',
      igreja: 'Tobias',
      regiao: 'Tobias',
      dataIngresso: new Date('2021-10-17'),
      frequenciaAtual: 2,
      frequenciaMeta: 6,
      atividadesAtual: 2,
      atividadesMeta: 6,
      grupo: 'MÍDIA'
    },
    {
      nome: 'joao',
      igreja: 'Tobias',
      regiao: 'Tobias',
      dataIngresso: new Date('2021-10-17'),
      frequenciaAtual: 2,
      frequenciaMeta: 6,
      atividadesAtual: 2,
      atividadesMeta: 6,
      grupo: 'MÍDIA'
    },
    {
      nome: 'joao',
      igreja: 'Tobias',
      regiao: 'Tobias',
      dataIngresso: new Date('2021-10-17'),
      frequenciaAtual: 2,
      frequenciaMeta: 6,
      atividadesAtual: 2,
      atividadesMeta: 6,
      grupo: 'MÍDIA'
    },
    {
      nome: 'joao',
      igreja: 'Tobias',
      regiao: 'Tobias',
      dataIngresso: new Date('2021-10-17'),
      frequenciaAtual: 2,
      frequenciaMeta: 6,
      atividadesAtual: 2,
      atividadesMeta: 6,
      grupo: 'MÍDIA'
    },
    {
      nome: 'Pedro',
      igreja: 'Sede',
      regiao: 'Tobias',
      dataIngresso: new Date('2021-10-11'),
      frequenciaAtual: 6,
      frequenciaMeta: 6,
      atividadesAtual: 4,
      atividadesMeta: 6,
      grupo: 'OFICINA'
    }
  ];

  abrirModal() {
    this.mostrarModalCadastro = true;
  }

  fecharModal() {
    this.mostrarModalCadastro = false;
  }

  cadastrarAluno(novoAluno: Aluno) {
    console.log('Dados prontos para enviar para a API (MongoDB):', novoAluno);
    
    // Adiciona na lista local temporariamente
    this.alunos.push(novoAluno);

    this.fecharModal();
  }
}