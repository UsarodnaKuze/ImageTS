import {environment} from '../environments/environment';
import {FrameExtractorService} from './frame-extractor.service';
import {Component, OnInit, ViewChild, AfterViewInit, ElementRef} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild('mainCanvas') mainCanvas: ElementRef;

  fx: FrameExtractorService;
  divider = 8;
  averages: number[];
  showPreview: false;

  constructor() {
    if (!environment.production) { // TODO ???
      (<any>window).app = this;
    }
  }

  ngAfterViewInit(): void {
    const fx = this.addNewView(this.mainCanvas.nativeElement);
    this.fx = fx;
    // this.setTimeUpdate(this.drawRealTimeShades, this);
  }

  drawShades() {
    this.averages = this.fx.transformations.averageDarknessBy(this.divider);
    this.fx.transformations.drawRectsBy(this.divider, this.averages);
  }

  /*setTimeUpdate(f: Function, context) {
    this.timeUpdate = () => f.call(context);
  }*/


  addNewView(canvas: HTMLCanvasElement, video?: HTMLVideoElement) {
    return new FrameExtractorService(canvas, video);
  }

  ngOnInit() {
  }


  drawRect(e: MouseEvent) {
    const target = (<HTMLCanvasElement>e.target);
    this.fx.drawRectangleToCoords(e.offsetX, e.offsetY, target);
  }
}


