import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FrameExtractorService} from '../frame-extractor.service';
import {environment} from '../../environments/environment';

@Component({
  selector: 'app-debugger',
  templateUrl: './debugger.component.html',
  styleUrls: ['./debugger.component.css']
})

export class DebuggerComponent implements OnInit {

  @ViewChild('previewVideo') previewVideo: ElementRef;
  @ViewChild('previewCanvas') previewCanvas: ElementRef;
  divider = 8;

  constructor() { }
  fx: FrameExtractorService;
  ngOnInit() {
    const fxPreview = this.addNewView(this.previewCanvas.nativeElement, this.previewVideo.nativeElement);
    this.fx = fxPreview;
    this.addNewCamera(this.previewVideo.nativeElement);
    // this.previewVideo.nativeElement.ontimeupdate = () => this.drawRealTimeShades(fxPreview);
    const interval = setInterval(() => this.drawRealTimeShades(fxPreview), 1000);
  }

  addNewCamera(video: HTMLVideoElement) {
    this.initCamera(video);
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

  drawRealTimeShades(fx: FrameExtractorService) {
    fx.drawFrame();
    this.drawShadesWithMargin(fx);
  }


  drawShadesWithMargin(fx: FrameExtractorService) {
    let all = 0;
    const averages = fx.transformations.averageDarknessBy(this.divider);
    averages.forEach((val) => all += val);
    const margin = all / averages.length;
    averages.forEach((val, i) => val > (margin * 1) ? averages[i] = 255 : averages[i] = 0);
    fx.transformations.drawRectsBy(this.divider, averages);
  }


  addNewView(canvas: HTMLCanvasElement, video?: HTMLVideoElement) {
    return new FrameExtractorService(canvas, video);
  }


}
