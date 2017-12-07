import {
  AfterViewChecked, AfterViewInit, Component, ElementRef, OnChanges, OnInit, SimpleChange,
  ViewChild
} from '@angular/core';
import {GlobalService} from '../global.service';
import {FrameExtractorService} from '../tools.service';
import {HttpClient} from '@angular/common/http';
import 'rxjs/add/observable/from';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements AfterViewInit, AfterViewChecked {
  @ViewChild('previewVideo') previewVideo: ElementRef;
  @ViewChild('previewCanvas') previewCanvas: ElementRef;
  private indexes: number[];
  private targetDarkness: number[];
  protected percentage = 0;
  currentGameIndex = -1;
  allowNext = false;
  gameStart = true;

  constructor(public global: GlobalService, private hc: HttpClient) {
  }

  fx: FrameExtractorService;

  start() {
    this.gameStart = false;
    this.next();
  }

  init() {
    const fxPreview = new FrameExtractorService(this.global, this.previewCanvas.nativeElement, this.previewVideo.nativeElement);
    this.fx = fxPreview;
    this.fx.initCamera(this.previewVideo.nativeElement);
    let i = 0;
    this.previewVideo.nativeElement.ontimeupdate = () => {
      i++;
      if (i > this.global.framesToSkip) {
        // console.log(i);
        i = 0;
        if (!this.indexes || !this.indexes.forEach) {
          return;
        }
        this.frameCompare();
      }
    };
    // const interval = setInterval(() => this.frameCompare(), 1000);
  }

  ngAfterViewChecked(): void {
    if (this.previewCanvas && !this.fx) {
      this.init();
    }
  }

  ngAfterViewInit() {
    if (this.global.imageDataStore.length === 0) {
      console.log('waiting for data');
      this.hc.get('./assets/imageData.txt').subscribe(data => {
        this.global.importDataStore(data);
      });
    } else {
      this.init();
    }
  }

  next() {
    this.allowNext = false;
    this.currentGameIndex++;
    if (this.currentGameIndex === this.global.imageDataStore.length) {
      alert('Game Over!');
      this.currentGameIndex = -1;
      this.gameStart = true;
      return;
    }
    this.fx.loadImageData(this.currentGameIndex);
    this.targetDarkness = this.fx.getExtremes();
    let index = 0;
    const rowLength = this.global.divider;
    const indexes = [];
    while (index < this.targetDarkness.length) {
      const pixel = this.targetDarkness[index];
      if (pixel > 0) {
        const pixelIndexes = [
          index,
          index - rowLength, // Over
          index + 1, // Right
          index + rowLength, // Under
          index - 1 // Left
        ];
        pixelIndexes.forEach(i => {
          if (indexes.indexOf(i) === -1 && i >= 0 && i < this.targetDarkness.length) {
            indexes.push(i);
          }
        });
      }
      index++;
    }
    this.indexes = indexes;
  }

  frameCompare() {
    let same = 0;
    const videoFrameData = this.fx.getFrameDataCanvas();
    const videoDarkness = this.fx.getExtremes(videoFrameData);
    this.indexes.forEach(i => {
      if (videoDarkness[i] === this.targetDarkness[i]) {
        same++;
      }
      // console.log(i, videoDarkness[i], this.targetDarkness[i]);
    });
    if (this.percentage > this.global.minimalPercentage) {
      this.allowNext = true;
    }
    this.percentage = Math.round((same / this.indexes.length) * 100);
  }
}
