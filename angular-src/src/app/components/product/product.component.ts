import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Product } from '../../models/Product';
import {AuthService} from '../../services/auth.service';

import { ProductService } from '../../services/product.service';
import { CartStore } from '../../store/cart.store';
import 'hammerjs';


@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent {

  products:Product[];
  quantity: number;

  constructor(private productService:ProductService,
              private router:Router,
              private cartStore: CartStore,
              private authService:AuthService) { }

  addToCart(product) {

    if(this.authService.loggedIn()) {
    // this.productService.addToCart(product)
        console.log(this.quantity)
        this.cartStore.addToCart(product, this.quantity || 1)
      } else {
        alert("Please Login Or register before Add item to Cart")
      }
}

  ngOnInit() {
     this.getProductData()
  }
  getProductData() {
     this.productService.getProducts().then(products => this.products = products)
}

}
