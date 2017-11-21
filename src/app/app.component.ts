import { environment } from '../environments/environment.prod';
import { FrameExtractorService } from './frame-extractor.service';
import { Event } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  video: HTMLVideoElement;
  canvas: HTMLCanvasElement;
  fx: FrameExtractorService;
  divider = 8;
  averages: number[];

  timeUpdate = (e) => console.log(e);

  constructor() {
    if (environment.production) { // TODO ???
      (<any>window).app = this;
    }
  }

  drawShades() {
    this.averages = this.fx.transformations.averageDarknessBy(this.divider)
    this.fx.transformations.drawRectsBy(this.divider, this.averages);
  }

  drawShadesWithMargin() {
    let all = 0;
    const averages = this.fx.transformations.averageDarknessBy(this.divider)
    averages.forEach((val) => all += val);
    const margin = all / averages.length;
    averages.forEach((val, i) => val > (margin * 1.2) ? averages[i] = 255 : averages[i] = 0);
    this.fx.transformations.drawRectsBy(this.divider, averages);
  }

  drawRealTimeShades() {
    this.fx.drawFrame();
    this.drawShadesWithMargin();
  }

  setTimeUpdate(f: Function, context) {
    this.timeUpdate = () => f.call(context);
  }

  ngOnInit() {
    this.initCamera();
    this.fx = new FrameExtractorService(this.canvas, this.video);

    this.setTimeUpdate(this.drawRealTimeShades, this);
  }

  initCamera() {
    const constraints = {
      audio: false,
      video: {width: 320, height: 240}
    };
    this.video = document.querySelector('video');
    this.canvas = document.querySelector('canvas');
    navigator.mediaDevices.getUserMedia(constraints)
      .then((mediaStream) => {
        this.video.srcObject = mediaStream;
        this.video.onloadedmetadata = (e) => {
          this.video.play();
        };
      })
      .catch((err) => {
        console.error(err.name + ': ' + err.message);
      }); // always check for errors at the end.
  }
}


