import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectUsersTableComponent } from './project-users-table.component';

describe('ProjectUsersTableComponent', () => {
  let component: ProjectUsersTableComponent;
  let fixture: ComponentFixture<ProjectUsersTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectUsersTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectUsersTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
