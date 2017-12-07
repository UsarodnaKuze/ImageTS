import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FrameExtractorService} from '../tools.service';
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
    this.fx = new FrameExtractorService(this.global, this.previewCanvas.nativeElement, this.previewVideo.nativeElement);
    this.fx.initCamera(this.previewVideo.nativeElement);
    let i = 0;
    this.previewVideo.nativeElement.ontimeupdate = () => {
      i++;
      if (i > this.global.framesToSkip) {
        i = 0;
        this.drawRealTimeShades();
      }
    };
  }

  drawRealTimeShades() {
    this.fx.drawFrame();
    this.fx.drawExtremeShadesWithMargin();
  }
}
