import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlunoCard } from './aluno-card';

describe('AlunoCard', () => {
  let component: AlunoCard;
  let fixture: ComponentFixture<AlunoCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlunoCard],
    }).compileComponents();

    fixture = TestBed.createComponent(AlunoCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
