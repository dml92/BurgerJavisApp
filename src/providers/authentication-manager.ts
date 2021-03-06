import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import { MenuController } from 'ionic-angular';

import { BASIC_PREFIX, JSON_HEADER_NAME, JSON_HEADER_VALUE } from '../app/commons';
import { Credentials } from '../app/credentials';
import { ROLE_ADMIN, ROLE_WAITER, ROLE_KITCHEN } from '../app/commons';

@Injectable()
export class AuthenticationManager {

  private credentials : Credentials;

  constructor(private menuCtrl: MenuController) {
    this.resetCredentials();
  }

  private enableSideMenu() {
    if(this.credentials.roles.length == 1) {
      switch (this.credentials.roles[0]) {
        case ROLE_ADMIN:
          this.menuCtrl.enable(true, "adminMenu");
          break;

        case ROLE_WAITER:
          this.menuCtrl.enable(true, "waiterMenu");
          break;

        case ROLE_KITCHEN:
          this.menuCtrl.enable(true, "kitchenMenu");
          break;
        
        default:
          throw "Invalid user role: " + this.credentials.roles[0];
      }
    } else {
      throw "Invalid user with multiple roles";      
    }
  }

  public setCredentials(credentials: Credentials) {
    this.credentials = credentials;
    this.enableSideMenu();
  }

  public resetCredentials() {
    this.credentials = new Credentials();
  }

  public getCredentials(): Credentials {
    return this.credentials;
  }

  public getRole(): string {
    if(this.credentials.roles.length == 1) {
      return this.credentials.roles[0];
    } else {
      throw "Invalid user with multiple roles";      
    }
  }

  public generateAuthHeader(): Headers {
    var ascii = this.credentials.username + ":" + this.credentials.password;
    if(ascii !== ":") {
      return new Headers({'Authorization': BASIC_PREFIX + 
                            new Buffer(ascii).toString('base64')});
    } else {
      return new Headers();
    }
  }

  public generateJsonAuthHeader(): Headers {
    var ascii = this.credentials.username + ":" + this.credentials.password;
    var headers = new Headers();
    headers.append(JSON_HEADER_NAME, JSON_HEADER_VALUE);
    headers.append('Authorization', BASIC_PREFIX + new Buffer(ascii).toString('base64'));
    return headers;
  }

  public isAdmin(): boolean {
    return this.credentials.roles.indexOf(ROLE_ADMIN) >= 0;
  }

}