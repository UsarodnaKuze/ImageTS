import {GlobalService} from './global.service';
import {environment} from '../environments/environment';

export class FrameExtractorService {
  ctx: CanvasRenderingContext2D;

  constructor(private global: GlobalService, private canvas: HTMLCanvasElement, private video?: HTMLVideoElement) {
    this.initCanvas(canvas);
    this.setCtx(canvas);
  }

  // CAMERA
  initCamera(video: HTMLVideoElement) {
    const constraints = {
      audio: false,
      video: {width: this.global.scales.x, height: this.global.scales.y, frameRate: 15, facingMode: ['environment'], aspectRatio: 1}
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

  // CANVAS

  private setCtx(canvas: HTMLCanvasElement) {
    this.ctx = canvas.getContext('2d');
  }

  private initCanvas(_canvas?: HTMLCanvasElement) {
    const canvas = this.getCanvas(_canvas);
    if (this.video) {
      canvas.width = this.global.scales.x;
      canvas.height = this.global.scales.y; // FIXME
    } else {
      canvas.width = this.global.scales.x;
      canvas.height = this.global.scales.y;
    }
  }

  public saveImageData() {
    this.global.imageDataStore.push(this.ctx.getImageData(0, 0, this.ctx.canvas.width, this.ctx.canvas.height));
  }

  public loadImageData(i: number) {
    this.ctx.putImageData(this.global.imageDataStore[i], 0, 0);
  }

  // DRAWING

  public antWar() {
    this.drawRandom();
    this.grayscale();
  }

  public drawRectangle(x, y, width, height, _canvas?, color?) {
    const canvas = this.getCanvas(_canvas);
    const ctx = canvas.getContext('2d');
    const rect = new Path2D();
    rect.rect(x, y, width, height);
    ctx.fillStyle = color ? color : 'red';
    ctx.fill(<any>rect);
  }

  public drawRectangleToCoords(x: number, y: number, elem: HTMLCanvasElement) {
    const rect = elem.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    const wd = w / this.global.divider * elem.width / rect.width;
    const hd = h / this.global.divider * elem.height / rect.height;
    const scaledX = x * elem.width / rect.width;
    const scaledY = y * elem.height / rect.height;
    const positionedX = scaledX - scaledX % wd;
    const positionedY = scaledY - scaledY % hd;
    this.drawRectangle(Math.floor(positionedX), Math.floor(positionedY), Math.ceil(wd), Math.ceil(hd), elem, 'black');
    // console.log(positionedX, positionedY, wd, hd, 'black');
  }

  private drawRandom() {
    const pixels = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    pixels.data.forEach((d, i) => pixels.data[i] = Math.round(Math.random() * 255));
    this.ctx.putImageData(pixels, 0, 0);
  }

  private grayscale() {
    const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
      data[i] = avg; // red
      data[i + 1] = avg; // green
      data[i + 2] = avg; // blue
    }
    this.ctx.putImageData(imageData, 0, 0);
  }

  // CANVAS TO CANVAS

  public getAverageDarknessFromCanvas(_canvas?: HTMLCanvasElement) {
    const canvas = this.getCanvas(_canvas);
    const darkness = this.averageDarknessByDivider(canvas);
    return darkness;
  }

  public drawExtremeShadesWithMargin(_canvas?: HTMLCanvasElement) {
    const canvas = this.getCanvas(_canvas);
    const averages = this.getExtremes(canvas);
    this.drawRectsByDivider(canvas, averages);
  }

  public getExtremes(_canvas?: HTMLCanvasElement) {
    const canvas = this.getCanvas(_canvas);
    let all = 0;
    const averages = this.averageDarknessByDivider(canvas);
    averages.forEach((val) => all += val);
    const margin = all / averages.length;
    averages.forEach((val, i) => val > (margin * this.global.marginModifier) ? averages[i] = 0 : averages[i] = 255);
    return averages;
  }

  public drawShades(_canvas?: HTMLCanvasElement) {
    const canvas = this.getCanvas(_canvas);
    const averages = this.averageDarknessByDivider(canvas);
    this.drawRectsByDivider(canvas, averages);
  }

  private doTaskByDivider(_canvas: HTMLCanvasElement, grayArray?: number[]) {
    const canvas = this.getCanvas(_canvas);
    const sqrt = this.global.divider;
    const ctx = canvas.getContext('2d');
    const divider = Math.pow(sqrt, 2);
    const horizontalDiv = canvas.width / sqrt;
    const verticalDiv = canvas.height / sqrt;
    const averages: number[] = [];
    let horizontalPos = 0;
    let verticalPos = 0;
    for (let i = 0; i < divider; i++) {
      const xStart = horizontalPos * Math.floor(horizontalDiv);
      const yStart = verticalPos * Math.floor(verticalDiv);
      const draw = () => {
        const c = 255 - grayArray[i];
        this.drawRectangle(xStart, yStart, Math.ceil(horizontalDiv), Math.ceil(verticalDiv), canvas, `rgba(${c},${c},${c},1)`);
        horizontalPos++;
        if (horizontalPos === sqrt) { // End of row
          horizontalPos = 0;
          verticalPos++;
        }
      };
      const getAverage = () => { // TODO review this
        const imageData = ctx.getImageData(xStart, yStart, Math.ceil(horizontalDiv), Math.ceil(verticalDiv));
        let currentValue = 0;
        let index = 0;
        while (index < imageData.data.length) {
          if (imageData.data[index + 3] === 0) {
            currentValue += 3 * 255;
          } else {
            currentValue += imageData.data[index] + imageData.data[index + 1] + imageData.data[index + 2];
          }
          index += 4;
        }
        const average = (currentValue / (imageData.data.length * 0.75));
        // console.log(imageData);
/*
        imageData.data.forEach(data => currentValue += data);
        const average = (currentValue / imageData.data.length);
*/
        averages.push(Math.round(average));
        horizontalPos++;
        if (horizontalPos === sqrt) { // End of row
          horizontalPos = 0;
          verticalPos++;
        }
      };
      if (grayArray) {
        draw();
      } else {
        getAverage();
      }
    }
    return averages;
  }

  private drawRectsByDivider(_canvas: HTMLCanvasElement, grayArray: number[]) {
    const canvas = this.getCanvas(_canvas);
    this.doTaskByDivider(canvas, grayArray);
  }

  private averageDarknessByDivider(_canvas: HTMLCanvasElement): number[] {
    const canvas = this.getCanvas(_canvas);
    return this.doTaskByDivider(canvas);
  }

  // CAMERA TO CANVAS

  public drawFrame(_canvas?: HTMLCanvasElement) {
    const canvas = this.getCanvas(_canvas);
    const ctx = canvas.getContext('2d');
    if (!this.video) {
      return;
    }
    this.initCanvas(canvas);
    this.video.pause();
    ctx.drawImage(this.video, 0, 0);
    if (this.video.currentTime < this.video.duration) {
      this.video.play();
    }
  }

  public getFrameDataCanvas(): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    this.drawFrame(canvas);
    return canvas;
  }

  private getCanvas(_canvas: HTMLCanvasElement) {
    let canvas = _canvas;
    if (!canvas) {
      canvas = this.canvas;
    }
    return canvas;
  }
}
