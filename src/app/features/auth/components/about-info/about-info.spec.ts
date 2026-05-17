import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutInfo } from './about-info';

describe('AboutInfo', () => {
  let component: AboutInfo;
  let fixture: ComponentFixture<AboutInfo>;

  beforeAll(() => {
    if (!('IntersectionObserver' in globalThis)) {
      class MockIntersectionObserver {
        observe() {}
        unobserve() {}
        disconnect() {}
      }
      (globalThis as unknown as { IntersectionObserver: typeof IntersectionObserver }).IntersectionObserver =
        MockIntersectionObserver as unknown as typeof IntersectionObserver;
    }
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutInfo],
    }).compileComponents();

    fixture = TestBed.createComponent(AboutInfo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
