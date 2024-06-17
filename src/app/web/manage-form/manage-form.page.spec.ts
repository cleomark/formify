import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { ManageFormPage } from './manage-form.page';

describe('ManageFormPage', () => {
  let component: ManageFormPage;
  let fixture: ComponentFixture<ManageFormPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ManageFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
