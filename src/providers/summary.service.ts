import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Util } from '../app/util';
import { Operations } from '../app/commons';
import { AuthenticationManager } from './authentication-manager';
import { Summary } from '../app/summary';

@Injectable()
export class SummaryService {

  summaryData: Summary;

  constructor(private http: Http, private auth: AuthenticationManager) {
  }

  getSummaryData(): Promise<Summary> {
    var request : string = Util.getUrlForAction(Operations.SUMMARY);
    return this.http.get(request,
        {headers: this.auth.generateAuthHeader()})
      .toPromise()
      .then(response => {
        this.summaryData = response.json() as Summary;
        return this.summaryData;
      });
  }

}