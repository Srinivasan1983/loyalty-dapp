import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { JsonpModule, Jsonp, Response } from '@angular/http';
import { HttpModule } from '@angular/http';
import { StoreModule } from '@ngrx/store';
import { MaterialModule } from '@angular/material';
import { RouterModule, Routes} from '@angular/router';
import {ValidateService} from './services/validate.service';
import { AuthService } from './services/auth.service';
import { ProductService } from './services/product.service';
import {AuthGuard} from './guards/auth.guard';
import { reducer } from './store/reducers';
import { CartStore } from './store/cart.store';
import { DBModule } from '@ngrx/db';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import {ScrollToModule} from 'ng2-scroll-to';


import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ProfileComponent } from './components/profile/profile.component';
import { HomeComponent } from './components/home/home.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { FlashMessagesModule } from 'angular2-flash-messages';
import { WalletComponent } from './components/wallet/wallet.component';
import { MycartComponent } from './components/mycart/mycart.component';
import { ProductComponent } from './components/product/product.component';


const appRoutes: Routes = [
  {path:'', component:HomeComponent},
  {path:'product', component:ProductComponent},
  {path:'register', component:RegisterComponent},
  {path:'login', component:LoginComponent},
  {path:'dashboard', component: DashboardComponent, canActivate:[AuthGuard]},
  {path:'profile', component: ProfileComponent, canActivate:[AuthGuard]},
  {path:'wallet', component: WalletComponent, canActivate:[AuthGuard]},
  {path:'mycart', component:MycartComponent, canActivate:[AuthGuard]}
]

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    RegisterComponent,
    ProfileComponent,
    HomeComponent,
    DashboardComponent,
    WalletComponent,
    MycartComponent,
    ProductComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    JsonpModule,
    HttpModule,
    StoreModule,
    RouterModule.forRoot(appRoutes),
    FlashMessagesModule,
    MaterialModule,
    StoreModule.provideStore(reducer),
    ScrollToModule.forRoot()

  ],
  providers: [ValidateService, AuthService, AuthGuard, ProductService, CartStore],
  bootstrap: [AppComponent]
})
export class AppModule { }
