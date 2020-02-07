import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TexComponent } from './tex.component';

describe('TexComponent', () => {
  let component: TexComponent;
  let fixture: ComponentFixture<TexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
