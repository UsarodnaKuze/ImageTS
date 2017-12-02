import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CanvasPreviewComponent } from './canvas-preview.component';

describe('CanvasPreviewComponent', () => {
  let component: CanvasPreviewComponent;
  let fixture: ComponentFixture<CanvasPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CanvasPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CanvasPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
