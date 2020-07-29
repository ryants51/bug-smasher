import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectTicketsTableComponent } from './project-tickets-table.component';

describe('ProjectTicketsTableComponent', () => {
  let component: ProjectTicketsTableComponent;
  let fixture: ComponentFixture<ProjectTicketsTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectTicketsTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectTicketsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
