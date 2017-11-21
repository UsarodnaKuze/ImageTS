export class FrameExtractorService {

  constructor(private canvas: HTMLCanvasElement, private video: HTMLVideoElement) {
      /*function onend(e) {
      var img;
      // do whatever with the frames
      for (var i = 0; i < array.length; i++) {
        img = new Image();
        img.onload = revokeURL;
        img.src = URL.createObjectURL(array[i]);
        document.body.appendChild(img);
      }
      // we don't need the video's objectURL anymore
      URL.revokeObjectURL(this.src);
    }*/
    this.ctx = canvas.getContext('2d');
  }

  array = [];
  ctx;
  pro = document.querySelector('#progress');
  transformations = {
    grayscale: () => {
      const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
          const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
          data[i]     = avg; // red
          data[i + 1] = avg; // green
          data[i + 2] = avg; // blue
      }
      this.ctx.putImageData(imageData, 0, 0);
    },
    drawRectsBy: (sqrt: number, grayArray: number[]) => {
      const divider = Math.pow(sqrt, 2);
      const horizontalDiv = this.canvas.width / sqrt;
      const verticalDiv = this.canvas.height / sqrt;
      let horizontalPos = 0;
      let verticalPos = 0;
      for (let i = 0; i < divider; i++) {
        const xStart = horizontalPos * horizontalDiv;
        const yStart = verticalPos * verticalDiv;
        const c = grayArray[i];
        this.drawRectangle(xStart, yStart, horizontalDiv, verticalDiv, `rgba(${c},${c},${c},1)`);
        horizontalPos++;
        if (horizontalPos === sqrt) { // End of row
          horizontalPos = 0;
          verticalPos++;
        }
      }
    },
    averageDarknessBy: (sqrt: number): number[] => {
      const divider = Math.pow(sqrt, 2);
      const averages: number[] = [];
      const imageDataArray = [];
      const horizontalDiv = this.canvas.width / sqrt;
      const verticalDiv = this.canvas.height / sqrt;
      let horizontalPos = 0;
      let verticalPos = 0;
      for (let i = 0; i < divider; i++) {
        const xStart = horizontalPos * horizontalDiv;
        const yStart = verticalPos * verticalDiv;
        const imageData = this.ctx.getImageData(xStart, yStart, horizontalDiv, verticalDiv);
        let currentValue = 0;
        imageData.data.forEach(data => currentValue += data);
        const average = currentValue / imageData.data.length;
        averages.push(Math.round(average));
        horizontalPos++;
        if (horizontalPos === sqrt) { // End of row
          horizontalPos = 0;
          verticalPos++;
        }
      }
      /*const data = imageData.data;
      const setSize = data.length / divider;
      const averages: number[] = [];
      let currentValue = 0;

      for (let i = 0; i < data.length; i++) {
        currentValue += data[i];
        if (i % setSize === 0) {
          averages.push(currentValue / setSize);
          currentValue = 0;
        }
      }*/
      return averages;
    }
  };

  public drawRectangle(x, y, width, height, color?) {
    const rect = new Path2D();
    rect.rect(x, y, width, height);
    this.ctx.fillStyle = color ? color : 'red';
    this.ctx.fill(rect);
  }

  public antWar (e) {
    this.drawRandom();
    this.transformations.grayscale();
  }

  initCanvas(e) {
    this.canvas.width = this.video.videoWidth;
    this.canvas.height = this.video.videoHeight;
  }

  public drawRandom() {
    const pixels = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    pixels.data.forEach((d, i) => pixels.data[i] = Math.round(Math.random() * 255));
    this.ctx.putImageData(pixels, 0, 0);
  }

  public drawFrame() {
    this.initCanvas(null);
    this.video.pause();
    this.ctx.drawImage(this.video, 0, 0);
    /*
    this will save as a Blob, less memory consumptive than toDataURL
    a polyfill can be found at
    https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob#Polyfill
    */
    this.canvas.toBlob(() => this.saveFrame, 'image/jpeg');
    /*this.pro.innerHTML = ((this.video.currentTime / this.video.duration) * 100).toFixed(2) + ' %';
    */
    if (this.video.currentTime < this.video.duration) {
      this.video.play();
    }
  }

  saveFrame(blob) {
    this.array.push(blob);
  }
  revokeURL(e) {
    URL.revokeObjectURL(this.video.src);
  }
}
