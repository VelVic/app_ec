import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EntrancePage } from './entrance.page';

describe('EntrancePage', () => {
  let component: EntrancePage;
  let fixture: ComponentFixture<EntrancePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EntrancePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
