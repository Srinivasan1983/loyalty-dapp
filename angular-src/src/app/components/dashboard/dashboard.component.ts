import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  wallet:any;
  transactionInfo:any;
  user:Object;
  query:any;

  constructor(private authService:AuthService, private router:Router, private flashMessages : FlashMessagesService) { }

  ngOnInit() {
  //  this.query = 'WalletSchema.find({"userIdentity" : user.username})'
  /*    this.authService.getWalletInfo().subscribe(walletInfo => {
      this.wallet = walletInfo.wallet;

    },
    err => {
      console.log(err);
      return false;
    });*/

    this.authService.getUserTransactionInfo().subscribe(transInfo => {
        this.transactionInfo = transInfo.transactionInfo;

      },
      err => {
        console.log(err);
        return false;
      });


    this.authService.getProfile().subscribe(profile => {
      this.user = profile.user;
    },
    err => {
      console.log(err);
      return false;
    });
  }

}
