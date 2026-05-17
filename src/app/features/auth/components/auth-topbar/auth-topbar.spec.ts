import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthTopbar } from './auth-topbar';

describe('AuthTopbar', () => {
  let component: AuthTopbar;
  let fixture: ComponentFixture<AuthTopbar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthTopbar],
    }).compileComponents();

    fixture = TestBed.createComponent(AuthTopbar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
