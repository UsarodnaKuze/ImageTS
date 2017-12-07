import { Component, OnInit } from '@angular/core';
import {GlobalService} from '../global.service';
import {Router} from '@angular/router';
import {animate, state, style, transition, trigger} from "@angular/animations";

@Component({
  selector: 'app-mainscreen',
  templateUrl: './mainscreen.component.html',
  styleUrls: ['./mainscreen.component.css'],
  animations: [
    trigger('flyInOut', [
      transition('void => *', [
        style({transform: 'translateX(100%)'}),
        animate(200)
      ]),
      transition('* => void', [
        animate(200, style({transform: 'translateX(100%)'}))
      ])
    ])
  ]
})
export class MainscreenComponent implements OnInit {

  constructor(public global: GlobalService, public router: Router) { }

  ngOnInit() {
  }

}
