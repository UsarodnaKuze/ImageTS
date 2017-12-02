import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FrameExtractorService} from '../frame-extractor.service';
import {GlobalService} from '../global.service';

@Component({
  selector: 'app-debugger',
  templateUrl: './debugger.component.html',
  styleUrls: ['./debugger.component.css']
})

export class DebuggerComponent implements OnInit {

  @ViewChild('previewVideo') previewVideo: ElementRef;
  @ViewChild('previewCanvas') previewCanvas: ElementRef;

  constructor(private global: GlobalService) { }
  fx: FrameExtractorService;
  ngOnInit() {
    const fxPreview = new FrameExtractorService(this.global, this.previewCanvas.nativeElement, this.previewVideo.nativeElement);
    this.fx = fxPreview;
    this.fx.initCamera(this.previewVideo.nativeElement);
    // this.previewVideo.nativeElement.ontimeupdate = () => this.drawRealTimeShades(fxPreview);
    const interval = setInterval(() => this.drawRealTimeShades(fxPreview), 1000);
  }

  drawRealTimeShades(fx: FrameExtractorService) {
    fx.drawFrame();
    fx.drawExtremeShadesWithMargin();
  }
}
