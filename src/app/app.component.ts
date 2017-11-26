import { environment } from '../environments/environment';
import { FrameExtractorService } from './frame-extractor.service';
import { Event } from '@angular/router';
import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'app';
  @ViewChild('previewVideo') previewVideo: ElementRef;
  @ViewChild('mainCanvas') mainCanvas: ElementRef;
  @ViewChild('previewCanvas') previewCanvas: ElementRef;

  fx: FrameExtractorService;
  divider = 8;
  averages: number[];

  constructor() {
    if (!environment.production) { // TODO ???
      (<any>window).app = this;
    }
  }
  ngAfterViewInit(): void {
    const fx = this.addNewView(this.mainCanvas.nativeElement);
    this.addNewCamera(this.previewVideo.nativeElement);
    const fxPreview = this.addNewView(this.previewCanvas.nativeElement, this.previewVideo.nativeElement);
    this.fx = fx;
    this.previewVideo.nativeElement.ontimeupdate = () => this.drawRealTimeShades(fxPreview);
    // this.setTimeUpdate(this.drawRealTimeShades, this);
  }

  drawShades() {
    this.averages = this.fx.transformations.averageDarknessBy(this.divider);
    this.fx.transformations.drawRectsBy(this.divider, this.averages);
  }

  drawShadesWithMargin(fx: FrameExtractorService) {
    let all = 0;
    const averages = fx.transformations.averageDarknessBy(this.divider);
    averages.forEach((val) => all += val);
    const margin = all / averages.length;
    averages.forEach((val, i) => val > (margin * 0.7) ? averages[i] = 255 : averages[i] = 0);
    fx.transformations.drawRectsBy(this.divider, averages);
  }

  drawRealTimeShades(fx: FrameExtractorService) {
    fx.drawFrame();
    this.drawShadesWithMargin(fx);
  }

  /*setTimeUpdate(f: Function, context) {
    this.timeUpdate = () => f.call(context);
  }*/

  addNewCamera(video: HTMLVideoElement) {
    this.initCamera(video);
  }

  addNewView(canvas: HTMLCanvasElement, video?: HTMLVideoElement) {
    return new FrameExtractorService(canvas, video);
  }

  ngOnInit() {
  }

  initCamera(video: HTMLVideoElement) {
    const constraints = {
      audio: false,
      video: {width: 320, height: 240, frameRate: 15, facingMode: 'environment'}
    };
    navigator.mediaDevices.getUserMedia(constraints)
      .then((mediaStream) => {
        video.srcObject = mediaStream;
        video.onloadedmetadata = (e) => {
          video.play();
        };
      })
      .catch((err) => {
        if (environment.production) {
          console.error(err.name + ': ' + err.message);
        } else {
          alert(err.message);
        }

      }); // always check for errors at the end.
  }
}


