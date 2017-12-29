import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class ConstantsProvider {
  grant_type: string;
  appid: string;
  client_id: any;
  client_secret: any;
  baseUrl: string;
  signuptitle:string;
  merchant_defaultImage :string='http://placehold.it/360x200';
  avtar_icon="assets/images/avatar-icon.png";
  public button_colour_1 = "#7DCA7D";
  public button_colour_2 = "#383838";
  public primary_colour = "#3B3B3B";
  public secondary_colour ='#7DCA7D';
  public carousel1 = 'assets/images/carousel1.png';
  public carousel2 = 'assets/images/carousel1.png';
  public carousel3 = 'assets/images/carousel3.png';
  constructor(public http: Http) {

    /*this.baseUrl="https://api-whitelabel.beli.co.uk/"; //Product server
    this.client_id="Iq14WqBLl45uKYWAvGq1wzYJ4dRdBkYlAn9iKBNS";
    this.client_secret="ItoDOSUTCSdfPeaM0jg5ADvoz0JnVzkEvREHe4ohSHEpYej6bBv4qd0Zx1qqVHfVukjtHg0tk5O6NyGgTF5eQq05XH8IYYl4qEzv1BRZ0Ksje98rzZiFYrbGTNYqJ72l";
    this.appid='FAB';*/


    this.baseUrl="http://api-whitelabel-stage.beli.co.uk/"; //development
    this.client_id="lVVfzzFvMlIpejXvbM9aAYtSUePwwv1WgGVfUXOU";
    this.client_secret="atJWZohERy6Q5pUGhY6p4DqsC1B1KLISz9W1K2dsacPUZfQcEOq5BDfFwN6w6NA3Z5miqXtUiC4vKeb2r3rZgVUkkXtakLavAFZbKuKzfLEYEWMeK4kRRd888aSIZ106";
    this.appid='KEU';

    this.grant_type='password';
  }

}
