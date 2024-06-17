import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { BrowseTemplatesPage } from './browse-templates.page';

describe('BrowseTemplatesPage', () => {
  let component: BrowseTemplatesPage;
  let fixture: ComponentFixture<BrowseTemplatesPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(BrowseTemplatesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
