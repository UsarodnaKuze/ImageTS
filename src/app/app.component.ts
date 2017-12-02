import {environment} from '../environments/environment';
import {Component, OnInit, AfterViewInit} from '@angular/core';
import {GlobalService} from './global.service';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  constructor(protected global: GlobalService) {
    if (!environment.production) { // TODO ???
      (<any>window).app = this;
    }
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
  }
}


