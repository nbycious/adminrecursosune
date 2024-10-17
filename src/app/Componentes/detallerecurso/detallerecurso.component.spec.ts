import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallerecursoComponent } from './detallerecurso.component';

describe('DetallerecursoComponent', () => {
  let component: DetallerecursoComponent;
  let fixture: ComponentFixture<DetallerecursoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetallerecursoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetallerecursoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
