import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Landing } from './landing';

describe('Landing', () => {
  let component: Landing;
  let fixture: ComponentFixture<Landing>;

  beforeAll(() => {
    if (!('IntersectionObserver' in globalThis)) {
      class MockIntersectionObserver {
        observe() {}
        unobserve() {}
        disconnect() {}
      }
      (
        globalThis as unknown as { IntersectionObserver: typeof IntersectionObserver }
      ).IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver;
    }
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Landing],
    }).compileComponents();

    fixture = TestBed.createComponent(Landing);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
