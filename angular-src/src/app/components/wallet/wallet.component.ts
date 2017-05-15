import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { ValidateService } from '../../services/validate.service';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.css']
})
export class WalletComponent implements OnInit {
  userTrans:any;
  user:String;
  userIdentity:String;
  domain_key:String;
  passphrase:String;
  username:String;
  keyPassword:String;
  userBal:String;
  walletInfo:any;
  name:String;
  amount:Number;
  address:String;
  password:String;
  pass:String;

  constructor(private authService:AuthService,
              private router:Router,
              private flashMessages : FlashMessagesService,
              private validateService: ValidateService ) { }

  ngOnInit() {
    this.authService.getProfile().subscribe(profile => {
      this.user = profile.user;
    },
    err => {
      console.log(err);
      return false;
    });



  }
createWallet(){
    const walletAddress = {
      userIdentity:this.user['username'],
      keyPassword:this.keyPassword
    }
    if(!this.validateService.validatePassword(walletAddress)) {
        this.flashMessages.show("Please Enter Password", {cssClass: 'alert-danger', timeout: 3000});
        return false;
    }
     this.authService.storeUserWallet(walletAddress).subscribe(keydata => {
      if(keydata.success){
         this.flashMessages.show("you got Wallet Address", {cssClass: 'alert-success', timeout: 3000});
         this.router.navigate(['/wallet']);
      }else{
         this.flashMessages.show("Something Went Wrong/ User already having keys", {cssClass: 'alert-danger', timeout: 3000});
         this.router.navigate(['/wallet']);
      }
    });

  }


  ongetUserTransactionByUsername(){
    const userTransaction = {
      username:this.user['username']
    }

     this.authService.getUserWalletTrans(userTransaction).subscribe(transactionInfo => {
      if(transactionInfo.success){
         this.userTrans = transactionInfo.userTrans;
         this.flashMessages.show("your Recent Transaction", {cssClass: 'alert-success', timeout: 3000});
         this.router.navigate(['/wallet']);
      }else{
         this.flashMessages.show("Something Went Wrong", {cssClass: 'alert-danger', timeout: 3000});
         this.router.navigate(['/wallet']);
      }
    });

  }

  onTransMadeByUser(){
    const userTransDetails = {
        name:this.user['username'],
        amount:this.amount,
        address:this.address,
        pass:this.pass
    }
    this.authService.usersTransaction(userTransDetails).subscribe(usertransactionInfo => {
     if(usertransactionInfo.success){
        this.flashMessages.show("You Made Transaction", {cssClass: 'alert-success', timeout: 3000});
        this.router.navigate(['/wallet']);
     }else{
        this.flashMessages.show("Something Went Wrong", {cssClass: 'alert-danger', timeout: 3000});
        this.router.navigate(['/wallet']);
     }
   });
  }

  ongetUserWalletInfoByUsername(){
    const userWalletInfo = {
      username:this.user['username']
    }

     this.authService.getUserWalletInfo(userWalletInfo).subscribe(walletInfo => {
      if(walletInfo.success){
         this.walletInfo = walletInfo.walletInfo;
         this.flashMessages.show("your Recent Transaction", {cssClass: 'alert-success', timeout: 3000});
         this.router.navigate(['/wallet']);
      }else{
         this.flashMessages.show("Something Went Wrong", {cssClass: 'alert-danger', timeout: 3000});
         this.router.navigate(['/wallet']);
      }
    });

  }

  onUserAccountUnlock(){
    const userUnlockInfo = {
      username:this.user['username'],
      password:this.password
    }

     this.authService.getUserAccountUnlock(userUnlockInfo).subscribe(unlockInfo => {
      if(unlockInfo.success){
         //this.walletInfo = walletInfo.walletInfo;
         this.flashMessages.show("you unlocked your Account", {cssClass: 'alert-success', timeout: 3000});
         this.router.navigate(['/wallet']);
      }else{
         this.flashMessages.show("Something Went Wrong", {cssClass: 'alert-danger', timeout: 3000});
         this.router.navigate(['/wallet']);
      }
    });

  }



}
