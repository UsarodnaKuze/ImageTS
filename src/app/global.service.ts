import {Injectable} from '@angular/core';

@Injectable()
export class GlobalService {
  divider = 8;
  marginModifier = 0.7;
  minimalPercentage = 80;
  framesToSkip = 3;
  showSettings = false;
  scales = {
    x: 320,
    y: 320
  };
  imageDataStore: ImageData[] = [];

  constructor() {
  }

  readData(file: File) {
    const reader = new FileReader();
    let data;
    reader.addEventListener('loadend', (ev: any) => {
      const text = ev.srcElement.result;
      data = JSON.parse(text);
      if (data && data.forEach) {
        this.importDataStore(data);
      }
    });
    reader.readAsText(file);
  }

  importDataStore(data) {
    data.forEach((iData) => {
      const array = Object.values(iData.data);
      const imgData = new ImageData(Uint8ClampedArray.from(array), iData.width || this.scales.x, iData.height || this.scales.y);
      this.imageDataStore.push(imgData);
    });
  }
}
