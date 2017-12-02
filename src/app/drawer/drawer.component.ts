import {ChangeDetectorRef, Component, ElementRef, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {FrameExtractorService} from '../frame-extractor.service';
import {GlobalService} from '../global.service';
import * as fs from 'file-saver/FileSaver.js';

@Component({
  selector: 'app-drawer',
  templateUrl: './drawer.component.html',
  styleUrls: ['./drawer.component.css']
})
export class DrawerComponent implements OnInit, OnChanges {
  @ViewChild('mainCanvas') mainCanvas: ElementRef;
  fx: FrameExtractorService;

  constructor(protected global: GlobalService, private cd: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.fx = new FrameExtractorService(this.global, this.mainCanvas.nativeElement);
  }

  saveData() {
    const blob = new Blob([JSON.stringify(this.global.imageDataStore)], {type: 'text/plain;charset=utf-8'});
    fs.saveAs(blob, 'imageData.txt');
  }

  loadData(e) {
    const file = <File>e.target.files[0];
    this.global.readData(file);
  }

  drawShades() {
    this.fx.drawShades();
  }

  drawRect(e: MouseEvent) {
    const target = (<HTMLCanvasElement>e.target);
    this.fx.drawRectangleToCoords(e.offsetX, e.offsetY, target);
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
  }

}
