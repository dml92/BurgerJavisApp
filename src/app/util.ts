import { AppConfig } from './app.config';
import { HTTP_PREFIX, API_PREFIX } from './commons';

export class Util {

  static getServerUrl(): string {
    return HTTP_PREFIX + AppConfig.getServerHost() + ":" +
              AppConfig.getServerPort();
  }

  static getUrlForAction(action: string, param: string = ""): string {
    return this.getServerUrl() + API_PREFIX + action + "/" + param;
  }

  static getToastParams(error: string): any {
    return { 
              message: error,
              duration: 3000,
              position: 'bottom'
           };
  }

}