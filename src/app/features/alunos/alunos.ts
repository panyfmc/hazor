import { Component } from '@angular/core';
import { AlunoCard } from './components/aluno-card/aluno-card';
import { Aluno } from './models/aluno-models';

@Component({
  selector: 'app-alunos',
  standalone: true,
  imports: [
    AlunoCard
  ],
  templateUrl: './alunos.html'
})


export class Alunos {

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

      grupo: 'MIDIA'
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

      grupo: 'MIDIA'
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

      grupo: 'MIDIA'
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

      grupo: 'MIDIA'
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

}



