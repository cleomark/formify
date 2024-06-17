import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JLAPage } from './jla.page';

describe('JLAPage', () => {
  let component: JLAPage;
  let fixture: ComponentFixture<JLAPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(JLAPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
