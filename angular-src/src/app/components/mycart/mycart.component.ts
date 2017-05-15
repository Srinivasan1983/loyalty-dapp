import { Component , ViewChild} from '@angular/core';
import { ProductService } from '../../services/product.service';
import { CartStore } from '../../store/cart.store';
import { Subscription } from 'rxjs/Subscription';
import {JsonpModule, Jsonp, Response} from '@angular/http';
import {Injectable} from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { ValidateService } from '../../services/validate.service';



import {Observable} from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/do';

@Component({
  selector: 'app-mycart',
  templateUrl: './mycart.component.html',
  styleUrls: ['./mycart.component.css']
})

@Injectable()
export class MycartComponent {



  public cart = [];
  public totalPrice: number;
  public totalQuantity: number;
  public cartSubscription: Subscription;

  public data;
  public symbol:string;
  public price_usd:number;
  public price_btc:number;

  public amount;
  public pass;
  public address;
  user:String;

  constructor(private productService:ProductService,
              private cartStore: CartStore,
              private jsonp: Jsonp,
              private authService:AuthService,
              private validateService: ValidateService,
              private router:Router,
              private flashMessages : FlashMessagesService) {

      var apiRoot = 'https://api.coinmarketcap.com/v1/ticker/ethereum';
    //  this.jsonp.request(apiRoot,  { method: 'Get' })
    // .map(res => res.json()).subscribe(data => console.log(data));

  this.jsonp.request('https://api.coinmarketcap.com/v1/ticker/ethereum/', function (error, response, body) {
				this.jsonp.response(JSON.parse(body)[0].price_usd);
});

   }

removeProduct(product) {
  this.cartStore.removeFromCart(product)
}

checkout() {
  alert('Sorry! Checkout will be coming soon!')
}

getTotalPrice() {
  let totalCost: Array<number> = []
  let quantity: Array<number> = []
  let intPrice: number
  let intQuantity: number
  this.cart.forEach((item, i) => {
    intPrice = parseInt(item.price)
    intQuantity = parseInt(item.quantity)
    totalCost.push(intPrice)
    quantity.push(intQuantity)
  })

  this.totalPrice = totalCost.reduce((acc, item) => {
    return acc += item
  }, 0)
  this.totalQuantity = quantity.reduce((acc, item) => {
    return acc += item
  }, 0)
}

  ngOnInit() {
    this.cartSubscription = this.cartStore.getState().subscribe(res => {
      this.cart = res.products
      this.getTotalPrice()
    })

    this.authService.getProfile().subscribe(profile => {
      this.user = profile.user;
    },
    err => {
      console.log(err);
      return false;
    });

}

ngOnDestroy() {
    this.cartSubscription.unsubscribe()
  }

  goTo(location: string): void {
    window.location.hash = location;
}


  onTransMadeByUser(){
    const userTransDetails = {
        name:this.user['username'],
        amount:this.totalPrice,
        address:this.address,
        pass:this.pass
    }

    //console.log(this.totalQuantity)
    if(!this.validateService.validateTransPassword(userTransDetails)) {
        this.flashMessages.show("Please Enter Password", {cssClass: 'alert-danger', timeout: 3000});
        return false;
    }
    this.authService.usersTransaction(userTransDetails).subscribe(usertransactionInfo => {
     if(usertransactionInfo.success){
        this.flashMessages.show("You Made Transaction", {cssClass: 'alert-success', timeout: 3000});
        this.router.navigate(['/mycart']);
     }else{
        this.flashMessages.show("Something Went Wrong", {cssClass: 'alert-danger', timeout: 3000});
        this.router.navigate(['/mycart']);
     }
   });
  }



}
