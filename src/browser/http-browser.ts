import { Injectable } from '@angular/core';
import { HTTP, HTTPResponse } from '@ionic-native/http';
import { Http, Response } from '@angular/http';

import { AuthenticationManager } from '../providers/authentication-manager';

class CustomResponse implements HTTPResponse {
  public status: number;
  public headers: any;
  public url: string;
  public data?: any;
  public error?: any;
  constructor (response: Response) {
    this.status = response.status;
    this.data = response.json();
    this.error = response.statusText;
    this.headers = response.headers;
    this.url = response.url;
  }
}

@Injectable()
export class HttpBrowser extends HTTP {

  constructor(private auth: AuthenticationManager, private http: Http) {
    super();
  }

  get(url: string, parameters: any, headers: any): Promise<HTTPResponse> {
    return this.http.get(url, {headers: this.auth.generateAuthHeader()})
      .toPromise()
      .then(response => {
        let httpResponse: HTTPResponse = new CustomResponse (response);
        return new Promise<HTTPResponse>((resolve) => {
          resolve(httpResponse);
        });
      })
      .catch(() => {
        return new Promise<HTTPResponse>((reject) => {
          reject();
        });
      });
  }

  put(url: string, body: any, headers: any): Promise<HTTPResponse> {
    return this.http.put(url, JSON.stringify(body),
        {headers: this.auth.generateJsonAuthHeader()})
      .toPromise()
      .then(response => {
        let httpResponse: HTTPResponse = new CustomResponse (response);
        return new Promise<HTTPResponse>((resolve) => {
          resolve(httpResponse);
        });
      })
      .catch(() => {
        return new Promise<HTTPResponse>((reject) => {
          reject();
        });
      });
  }

  post(url: string, body: any, headers: any): Promise<HTTPResponse> {
    return this.http.post(url, JSON.stringify(body),
        {headers: this.auth.generateJsonAuthHeader()})
      .toPromise()
      .then(response => {
        let httpResponse: HTTPResponse = new CustomResponse (response);
        return new Promise<HTTPResponse>((resolve) => {
          resolve(httpResponse);
        });
      })
      .catch(() => {
        return new Promise<HTTPResponse>((reject) => {
          reject();
        });
      });
  }

  delete(url: string, parameters: any, headers: any): Promise<HTTPResponse> {
    return this.http.delete(url, {headers: this.auth.generateAuthHeader()})
      .toPromise()
      .then(response => {
        let httpResponse: HTTPResponse = new CustomResponse (response);
        return new Promise<HTTPResponse>((resolve) => {
          resolve(httpResponse);
        });
      })
      .catch(() => {
        return new Promise<HTTPResponse>((reject) => {
          reject();
        });
      });
  }

  getBasicAuthHeader(username: string, password: string): any {
    return null;
  }

}