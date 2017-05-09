import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  //fullImagePath: string;
  //private LOGO = require("angular-src/src/assets/images/img_1.png");

  constructor(private authService:AuthService) {
    //this.fullImagePath = 'angular-src/src/assets/images/img_1.png'
  }

  ngOnInit() {

  }

}
