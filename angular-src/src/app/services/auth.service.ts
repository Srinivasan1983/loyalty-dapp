import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import {tokenNotExpired} from 'angular2-jwt';

@Injectable()
export class AuthService {
  authToken : any;
  user : any;
  useraddress : any;

  constructor(private http:Http) { }

  registerUser(user){
    let headers = new Headers();
    headers.append('content-Type','application/json');
    return this.http.post('http://localhost:3000/users/register', user, {headers:headers})
        .map(res => res.json());

  }

  usersTransaction(userTransDetails){
    let headers = new Headers();
    headers.append('content-Type','application/json');
    return this.http.post('http://localhost:3000/wallet/transaction', userTransDetails, {headers:headers})
        .map(res => res.json());

  }

  authenticateUser(user) {
    let headers = new Headers();
    headers.append('content-Type','application/json');
    return this.http.post('http://localhost:3000/users/authenticate', user, {headers:headers})
        .map(res => res.json());

  }

  getProfile(){
    let headers = new Headers();
    this.loadToken();
    headers.append('Authorization',this.authToken);
    headers.append('content-Type','application/json');
    return this.http.get('http://localhost:3000/users/profile', {headers:headers})
        .map(res => res.json());
  }


  storeUserWallet(walletAddress){
    let headers = new Headers();
    headers.append('content-Type','application/json');
    return this.http.post('http://localhost:3000/wallet/wallet', walletAddress,  {headers:headers})
        .map(res => res.json());
  }

  getUserWalletTrans(username){
    let headers = new Headers();
    headers.append('content-Type','application/json');
    return this.http.post('http://localhost:3000/wallet/userTrans', username,  {headers:headers})
  //return this.http.post('http://localhost:3000/wallet/userProfileTrans', username,  {headers:headers})
        .map(res => res.json());
  }

  getWalletInfo(){
    let headers = new Headers();
    this.loadToken();
    headers.append('Authorization',this.authToken);
    headers.append('content-Type','application/json');
    return this.http.get('http://localhost:3000/wallet/dashboard', {headers:headers})
        .map(res => res.json());
  }

  getUserWalletInfo(username){
    let headers = new Headers();
    headers.append('content-Type','application/json');
    return this.http.post('http://localhost:3000/wallet/walletInfo',username, {headers:headers})
        .map(res => res.json());
  }


  storeUserData(token, user){
    localStorage.setItem('id_token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.authToken = token;
    this.user = user;
  }

  loadToken(){
    const token = localStorage.getItem('id_token');
    this.authToken = token;
  }

  loggedIn(){
      return tokenNotExpired('id_token');
  }

  logout(){
    this.authToken = null;
    this.user= null;
    localStorage.clear();
  }

}
