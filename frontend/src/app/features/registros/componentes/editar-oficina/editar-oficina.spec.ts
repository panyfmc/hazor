import { ComponentFixture, TestBed } from '@angular/core/testing'
import { of } from 'rxjs'
import { EditarOficina } from './editar-oficina'
import { AlunoService } from '../../../../core/services/aluno-service'

describe('EditarOficina', () => {
  let component: EditarOficina
  let fixture: ComponentFixture<EditarOficina>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarOficina],
      providers: [
        {
          provide: AlunoService,
          useValue: {
            listar: () => of([])
          }
        }
      ]
    }).compileComponents()

    fixture = TestBed.createComponent(EditarOficina)
    component = fixture.componentInstance
    await fixture.whenStable()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('toggleDropDownSeletor alterna dropdownSeletorAberto', () => {
    expect(component.dropdownSeletorAberto).toBe(false)

    component.toggleDropDownSeletor()
    expect(component.dropdownSeletorAberto).toBe(true)

    component.toggleDropDownSeletor()
    expect(component.dropdownSeletorAberto).toBe(false)
  })

  it('fecharModal emite fechar sem alterar o estado do select', () => {
    component.dropdownSeletorAberto = true
    let fechou = false
    component.fechar.subscribe(() => {
      fechou = true
    })

    component.fecharModal()

    expect(fechou).toBe(true)
    expect(component.dropdownSeletorAberto).toBe(true)
  })
})
