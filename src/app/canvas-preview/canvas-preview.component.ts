import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-canvas-preview',
  templateUrl: './canvas-preview.component.html',
  styleUrls: ['./canvas-preview.component.css']
})
export class CanvasPreviewComponent implements OnInit {
  @Input() imageData: ImageData;
  @ViewChild('canvas') canvas: ElementRef;

  constructor() { }

  ngOnInit() {
    const canvas = <HTMLCanvasElement>this.canvas.nativeElement;
    canvas.width = this.imageData.width;
    canvas.height = this.imageData.height;
    canvas.getContext('2d').putImageData(this.imageData, 0, 0);
  }

}
