import { Component, OnInit } from '@angular/core';
import {GlobalService} from '../global.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-mainscreen',
  templateUrl: './mainscreen.component.html',
  styleUrls: ['./mainscreen.component.css']
})
export class MainscreenComponent implements OnInit {

  constructor(public global: GlobalService, public router: Router) { }

  ngOnInit() {
  }

}