import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitorCount } from './visitor-count';

describe('VisitorCount', () => {
  let component: VisitorCount;
  let fixture: ComponentFixture<VisitorCount>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisitorCount]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisitorCount);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
