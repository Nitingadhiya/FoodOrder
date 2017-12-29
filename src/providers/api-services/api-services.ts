import { Injectable } from '@angular/core';
import { ConstantsProvider } from "../constants/constants";
import { Http, Response,Headers } from '@angular/http';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Observable } from "rxjs/Rx";
import { AlertController,Platform } from 'ionic-angular';
import { GlobalVarService } from '../constants/global-var';
import { Network } from '@ionic-native/network';

const request_timeout :number = 15000;
@Injectable()
export class ApiServicesProvider {
    alert: any;
    accessToken : string = '';
    constructor(public http: Http, public constants: ConstantsProvider, public alertCtrl: AlertController, public globalService: GlobalVarService,private network: Network,public platform: Platform) {
        console.log('Hello ApiServicesProvider Provider');
    }

    /*network_connect()
    {
      this.platform.ready().then(() => {
        if (this.platform.is('cordova'))
        {
            this.network.onConnect().subscribe(() => {
                console.log('network connected!');
            });
            this.network.onDisconnect().subscribe(() => {
              this.globalService.presentToast(this.globalService.connectivity);
            });
        }
      });
    }*/

    signup(avatar_url, email, phone_number, name, password) {

      let headers = new Headers();
        headers.append("Accept", 'application/json');
        headers.append("App-ID", this.constants.appid);
        var data = {
            "avatar_url": avatar_url,
            "email": email,
            "phone_number": phone_number,
            "name": name,
            "password": password,
        };
        return this.http.post(this.constants.baseUrl + "users/", data,{headers: headers})
        .timeout(request_timeout)
            .do((res: Response) => {})
            .map((res: Response) => res.json())
            .catch((error: any) => {
                return Observable.throw(new Error(error.status));
            });
    }
    forgotpass(email) {
      let headers = new Headers();
        headers.append("Accept", 'application/json');
        headers.append("App-ID", this.constants.appid);
        var data ={
            email:email
          }
        return this.http.post(this.constants.baseUrl + "users/password/reset/", data,{headers: headers})
        .timeout(request_timeout)
            .do((res: Response) => {})
            .map((res: Response) => res.json())
            .catch((error: any) => {
                return Observable.throw(new Error(error.status));
            });
    }
    showAlert(title, subTitle, action) {
        let alert = this.alertCtrl.create({
          title: title,
          subTitle: subTitle,
          buttons: ['OK']
        });
        alert.present();
      }

    signin(email, password, grant_type) {
      let headers = new Headers();
        headers.append("Accept", 'application/json');
        headers.append("App-ID", this.constants.appid);

        var data = {
            client_id: this.constants.client_id,
            client_secret: this.constants.client_secret,
            grant_type: this.constants.grant_type,
            username: email,
            password: password
        };
        var data_url = this.constants.baseUrl + "o/token/";
        return this.http.post(data_url, data,{headers: headers})
          .timeout(request_timeout)
            .do((res: Response) => {})
            .map((res: Response) => res.json())
            .catch((error: any) => {
                return Observable.throw(new Error(error.status));
            });
    }

    GetBrandName()
    {
      this.accessToken = this.globalService.token_type+' '+this.globalService.access_token;
      let headers = new Headers();
        headers.append("Accept", 'application/json');
        headers.append("App-ID", this.constants.appid);

        var url = this.constants.baseUrl +'apps/'+ this.constants.appid+"/";
      return this.http.get(url,{headers: headers})
      .timeout(request_timeout)
        .do((res: Response) =>{})
        .map((res: Response) => res.json())
        .catch((error: any) => {
            return Observable.throw(new Error(error.status));
      });
    }

    GetMerchantName(brand_id)
    {
      this.accessToken = this.globalService.token_type+' '+this.globalService.access_token;
      let headers = new Headers();
        headers.append("Accept", 'application/json');
        headers.append("App-ID", this.constants.appid);
        if(this.globalService.access_token)
        {
            headers.append("Authorization", this.accessToken);
        }
      var url = this.constants.baseUrl + "brands/"+brand_id+"/";
      return this.http.get(url,{ headers: headers })
        .timeout(request_timeout)
        .do((res: Response) => {})
        .map((res: Response) => res.json())
        .catch((error: any) => {
          if(error.status == 0 && this.globalService.toastShow == false)
          {
            this.globalService.presentToast(this.globalService.connectivity);
          }
            return Observable.throw(new Error(error.status));
        });
    }
    GetMerchantDetails(merchant_id)
    {
      if(merchant_id)
      {
      this.accessToken = this.globalService.token_type+' '+this.globalService.access_token;
      let headers = new Headers();
        headers.append("Accept", 'application/json');
        headers.append("App-ID", this.constants.appid);
        var url = this.constants.baseUrl + "merchants/"+merchant_id+"/";
      return this.http.get(url,{headers: headers})
        .timeout(request_timeout)
        .do((res: Response) => {})
        .map((res: Response) => res.json())
        .catch((error: any) => {
          if(error.status == 0 && this.globalService.toastShow == false)
          {
            this.globalService.presentToast(this.globalService.connectivity);
          }
            return Observable.throw(new Error(error.status));
        });
      }
    }
    GetMerchantMenuName(menu_id)
    {
      this.accessToken = this.globalService.token_type+' '+this.globalService.access_token;
      let headers = new Headers();
        headers.append("Accept", 'application/json');
        headers.append("App-ID", this.constants.appid);
      var url = this.constants.baseUrl + "menus/"+menu_id;
      return this.http.get(url,{headers: headers})
        .timeout(request_timeout)
        .do((res: Response) => {})
        .map((res: Response) => res.json())
        .catch((error: any) => {
            return Observable.throw(new Error(error.status));
        });
    }

    GetDistanceTime(lat,lng)
    {
      let headers = new Headers();
        headers.append("Accept", 'application/json');
        headers.append("App-ID", this.constants.appid);

      var user_latitude = this.globalService.latitude || localStorage.getItem('latitude');
      var user_longitude = this.globalService.longitude || localStorage.getItem('longitude');
      var url = "http://maps.googleapis.com/maps/api/distancematrix/json?origins="+user_latitude+","+user_longitude+"&destinations="+lat+","+lng;
      return this.http.get(url,{headers: headers})
        .timeout(request_timeout)
        .do((res: Response) => {})
        .map((res: Response) => res.json())
        .catch((error: any) => {
            return Observable.throw(new Error(error.status));
        });
    }

    GetProductOption(data)
    {
      this.accessToken = this.globalService.token_type+' '+this.globalService.access_token;
      let headers = new Headers();
        headers.append("Accept", 'application/json');
        headers.append("App-ID", this.constants.appid);
        var url = this.constants.baseUrl + "products/"+data+"/";
      return this.http.get(url,{headers: headers})
        .timeout(request_timeout)
        .do((res: Response) => {})
        .map((res: Response) => res.json())
        .catch((error: any) => {
          if(error.status == 0 && this.globalService.toastShow == false)
          {
            this.globalService.presentToast(this.globalService.connectivity);
          }
            return Observable.throw(new Error(error.status));
        });
    }

    product_Order(data)
    {
      this.accessToken = this.globalService.token_type+' '+this.globalService.access_token;
      let headers = new Headers();
        headers.append("Accept", 'application/json');
        headers.append("App-ID", this.constants.appid);
        if(this.globalService.access_token)
        {
          headers.append("Authorization", this.accessToken);
        }
        var url = this.constants.baseUrl + "orders/";
      return this.http.post(url, data,{headers: headers})
        .timeout(request_timeout)
        .do((res: Response) => {})
        .map((res: Response) => res.json())
        .catch((error: any) => {
          if(error.status == 0 && this.globalService.toastShow == false)
          {
            this.globalService.presentToast(this.globalService.connectivity);
          }
            return Observable.throw(new Error(error.status));
        });
    }

    get_user_id()
    {
      this.accessToken = this.globalService.token_type+' '+this.globalService.access_token;
      let headers = new Headers();
        headers.append("Accept", 'application/json');
        headers.append("App-ID", this.constants.appid);
        headers.append("Authorization", this.accessToken);

        var url = this.constants.baseUrl + "users/me/";
        console.log(url);
      return this.http.get(url,{ headers: headers })
        .timeout(request_timeout)
        .do((res: Response) => {})
        .map((res: Response) => res.json())
        .catch((error: any) => {
            return Observable.throw(new Error(error.status));
        });
    }

    SetCardName(data)
    {
      this.accessToken = this.globalService.token_type+' '+this.globalService.access_token;
      let headers = new Headers();
        headers.append("Accept", 'application/json');
        headers.append("App-ID", this.constants.appid);
        headers.append("Authorization", this.accessToken);
        var url = this.constants.baseUrl + "users/me/set_card/";
        return this.http.post(url, data,{headers: headers})
        .timeout(request_timeout)
        .do((res: Response) => {})
        .map((res: Response) => res.json())
        .catch((error: any) => {
          if(error.status == 0 && this.globalService.toastShow == false)
          {
            this.globalService.presentToast(this.globalService.connectivity);
          }
            return Observable.throw(new Error(error.status));
        });
    }

    DeleteCardName(data)
    {
      this.accessToken = this.globalService.token_type+' '+this.globalService.access_token;
      let headers = new Headers();
        headers.append("Accept", 'application/json');
        headers.append("App-ID", this.constants.appid);
        headers.append("Authorization", this.accessToken);
        var url = this.constants.baseUrl + "users/me/delete_card/";
        return this.http.post(url, data,{headers: headers})
        .timeout(request_timeout)
        .do((res: Response) => {})
        .map((res: Response) => res.json())
        .catch((error: any) => {
          if(error.status == 0 && this.globalService.toastShow == false)
          {
            this.globalService.presentToast(this.globalService.connectivity);
          }
            return Observable.throw(new Error(error.status));
        });
    }

    GetProfileInfo()
    {
      this.accessToken = this.globalService.token_type+' '+this.globalService.access_token;
      let headers = new Headers();
        headers.append("Accept", 'application/json');
        headers.append("App-ID", this.constants.appid);
        headers.append("Authorization", this.accessToken);

        var url = this.constants.baseUrl + "users/"+this.globalService.user_id+"/";
        return this.http.get(url,{headers: headers})
        .timeout(request_timeout)
        .do((res: Response) => {})
        .map((res: Response) => res.json())
        .catch((error: any) => {
          if(error.status == 0 && this.globalService.toastShow == false)
          {
            this.globalService.presentToast(this.globalService.connectivity);
          }
            return Observable.throw(new Error(error.status));
        });
    }

    UpdateProfileInfo(data)
    {
      this.accessToken = this.globalService.token_type+' '+this.globalService.access_token;
      let headers = new Headers();
        headers.append("Accept", 'application/json');
        headers.append("App-ID", this.constants.appid);
        headers.append("Authorization", this.accessToken);
      var url = this.constants.baseUrl + "users/"+this.globalService.user_id+"/";
      return this.http.put(url, data, {headers: headers})
        .timeout(request_timeout)
        .do((res: Response) => {})
        .map((res: Response) => res.json())
        .catch((error: any) => {
          if(error.status == 0 && this.globalService.toastShow == false)
          {
            this.globalService.presentToast(this.globalService.connectivity);
          }
            return Observable.throw(new Error(error.status));
        });
    }

    SetPassword(data)
    {
      this.accessToken = this.globalService.token_type+' '+this.globalService.access_token;
      let headers = new Headers();
        headers.append("Accept", 'application/json');
        headers.append("App-ID", this.constants.appid);
        headers.append("Authorization", this.accessToken);

      var url = this.constants.baseUrl + "users/"+this.globalService.user_id+"/set_password/";
      return this.http.post(url, data, {headers: headers})
        .timeout(request_timeout)
        .do((res: Response) => {})
        .map((res: Response) => res.json())
        .catch((error: any) => {
          if(error.status == 0 && this.globalService.toastShow == false)
          {
            this.globalService.presentToast(this.globalService.connectivity);
          }
            return Observable.throw(new Error(error.status));
        });
    }

    Get_receipts(limit, offset, data_url)
    {
      var url='';
      this.accessToken = this.globalService.token_type+' '+this.globalService.access_token;
      let headers = new Headers();
        headers.append("Accept", 'application/json');
        headers.append("App-ID", this.constants.appid);
        headers.append("Authorization", this.accessToken);

        if(data_url)
        {
          url = data_url;
        }
        else
        {
          url = this.constants.baseUrl + "orders/"; //?limit="+limit+"&offset="+offset
        }
      return this.http.get(url, {headers: headers})
        .timeout(request_timeout)
        .do((res: Response) => {})
        .map((res: Response) => res.json())
        .catch((error: any) => {
          if(error.status == 0 && this.globalService.toastShow == false)
          {
            this.globalService.presentToast(this.globalService.connectivity);
          }
            return Observable.throw(new Error(error));
        });
    }

    Get_receipts_details(id)
    {
      this.accessToken = this.globalService.token_type+' '+this.globalService.access_token;
      let headers = new Headers();
        headers.append("Accept", 'application/json');
        headers.append("App-ID", this.constants.appid);
        headers.append("Authorization", this.accessToken);

      var url = this.constants.baseUrl + "orders/"+id+"/";
      return this.http.get(url, {headers: headers})
        .timeout(request_timeout)
        .do((res: Response) => {})
        .map((res: Response) => res.json())
        .catch((error: any) => {
          if(error.status == 0 && this.globalService.toastShow == false)
          {
            this.globalService.presentToast(this.globalService.connectivity);
          }
            return Observable.throw(new Error(error._));
        });
    }

    Add_Favourite(data)
    {
      this.accessToken = this.globalService.token_type+' '+this.globalService.access_token;
      let headers = new Headers();
        headers.append("Accept", 'application/json');
        headers.append("App-ID", this.constants.appid);
        headers.append("Authorization", this.accessToken);

      var url = this.constants.baseUrl + "favourites/";
      return this.http.post(url, data, {headers: headers})
        .timeout(request_timeout)
        .do((res: Response) => {})
        .map((res: Response) => res.json())
        .catch((error: any) => {
          if(error.status == 0 && this.globalService.toastShow == false)
          {
            this.globalService.presentToast(this.globalService.connectivity);
          }
            return Observable.throw(new Error(error.status));
        });
    }

    Get_Favourite(limit, offset, data_url)
    {
      var url='';
      this.accessToken = this.globalService.token_type+' '+this.globalService.access_token;
      let headers = new Headers();
        headers.append("Accept", 'application/json');
        headers.append("App-ID", this.constants.appid);
        headers.append("Authorization", this.accessToken);
        if(data_url)
        {
          url = data_url;
        }
        else
        {
          url = this.constants.baseUrl + "favourites/"; //?limit="+limit+"&offset="+offset
        }
      return this.http.get(url, {headers: headers})
        .timeout(request_timeout)
        .do((res: Response) => {})
        .map((res: Response) => res.json())
        .catch((error: any) => {
          if(error.status == 0 && this.globalService.toastShow == false)
          {
            this.globalService.presentToast(this.globalService.connectivity);
          }
            return Observable.throw(new Error(error._body));
        });
    }

    Get_Favourite_details(id)
    {
      this.accessToken = this.globalService.token_type+' '+this.globalService.access_token;
      let headers = new Headers();
        headers.append("Accept", 'application/json');
        headers.append("App-ID", this.constants.appid);
        headers.append("Authorization", this.accessToken);
      var url = this.constants.baseUrl + "favourites/"+id+"/";
      return this.http.get(url, {headers: headers})
        .timeout(request_timeout)
        .do((res: Response) => {})
        .map((res: Response) => res.json())
        .catch((error: any) => {
          if(error.status == 0 && this.globalService.toastShow == false)
          {
            this.globalService.presentToast(this.globalService.connectivity);
          }
            return Observable.throw(new Error(error._body));
        });
    }

    remove_Favourite(id)
    {
      this.accessToken = this.globalService.token_type+' '+this.globalService.access_token;
      let headers = new Headers();
        headers.append("Accept", 'application/json');
        headers.append("App-ID", this.constants.appid);
        headers.append("Authorization", this.accessToken);
      var url = this.constants.baseUrl + "favourites/"+id+"/";
      return this.http.delete(url, {headers: headers})
        .timeout(request_timeout)
        .do((res: Response) => {})
        .map((res: Response) => res.json())
        .catch((error: any) => {
          if(error.status == 0 && this.globalService.toastShow == false)
          {
            this.globalService.presentToast(this.globalService.connectivity);
          }
            return Observable.throw(new Error(error.status));
        });
    }

    GetRewards_list()
    {
      this.accessToken = this.globalService.token_type+' '+this.globalService.access_token;
      let headers = new Headers();
        headers.append("Accept", 'application/json');
        headers.append("App-ID", this.constants.appid);
        headers.append("Authorization", this.accessToken);
      var url = this.constants.baseUrl + "reward-programs/";
      return this.http.get(url, {headers: headers})
        .timeout(request_timeout)
        .do((res: Response) => {})
        .map((res: Response) => res.json())
        .catch((error: any) => {
          if(error.status == 0 && this.globalService.toastShow == false)
          {
            this.globalService.presentToast(this.globalService.connectivity);
          }
            return Observable.throw(new Error(error.status));
        });
    }

    send_quotes_basket(data)
    {
      this.accessToken = this.globalService.token_type+' '+this.globalService.access_token;
      let headers = new Headers();
        headers.append("Accept", 'application/json');
        headers.append("App-ID", this.constants.appid);
        if(this.globalService.access_token)
        {
          headers.append("Authorization", this.accessToken);
        }
      var url = this.constants.baseUrl + "quotes/";
      return this.http.post(url,data ,{headers: headers})
        .timeout(request_timeout)
        .do((res: Response) => {})
        .map((res: Response) => res.json())
        .catch((error: any) => {
          if(error.status == 0 && this.globalService.toastShow == false)
          {
            this.globalService.presentToast(this.globalService.connectivity);
          }
            return Observable.throw(new Error(error.status));
        });
    }
    postactivity(data)
    {
      this.accessToken = this.globalService.token_type+' '+this.globalService.access_token;
      let headers = new Headers();
        headers.append("Accept", 'application/json');
        headers.append("App-ID", this.constants.appid);
        headers.append("Authorization", this.accessToken);
      var url = this.constants.baseUrl + "activity/";
      return this.http.post(url,data,{headers: headers})
        .timeout(request_timeout)
        .do((res: Response) => {})
        .map((res: Response) => res.json())
        .catch((error: any) => {
            return Observable.throw(new Error(error.status));
        });
    }

    walking_times(id,lat,long)
    {
      this.accessToken = this.globalService.token_type+' '+this.globalService.access_token;
      let headers = new Headers();
        headers.append("Accept", 'application/json');
        headers.append("App-ID", this.constants.appid);
        if(this.globalService.access_token)
        {
            headers.append("Authorization", this.accessToken);
        }
      var url = this.constants.baseUrl + "walking-times/"+id+"?lat="+lat+"&long="+long;
      return this.http.get(url,{headers: headers})
        .timeout(request_timeout)
        .do((res: Response) => {})
        .map((res: Response) => res.json())
        .catch((error: any) => {
            return Observable.throw(new Error(error.status));
        });
    }

    Getslot_time(id)
    {
      this.accessToken = this.globalService.token_type+' '+this.globalService.access_token;
      let headers = new Headers();
        headers.append("Accept", 'application/json');
        headers.append("App-ID", this.constants.appid);
        if(this.globalService.access_token)
        {
          headers.append("Authorization", this.accessToken);
        }
      var url = this.constants.baseUrl + "merchants/"+id+"/slots/";
      return this.http.get(url,{headers: headers})
        .timeout(request_timeout)
        .do((res: Response) => {})
        .map((res: Response) => res.json())
        .catch((error: any) => {
          if(error.status == 0 && this.globalService.toastShow == false)
          {
            this.globalService.presentToast(this.globalService.connectivity);
          }
            return Observable.throw(new Error(error.status));
        });
    }

    GetEnterLocation(data)
    {
      this.accessToken = this.globalService.token_type+' '+this.globalService.access_token;
      let headers = new Headers();
        headers.append("Accept", 'application/json');
        headers.append("App-ID", this.constants.appid);
        headers.append("Authorization", this.accessToken);
      var url = this.constants.baseUrl + "activity/";
      return this.http.post(url,data,{headers: headers})
        .timeout(request_timeout)
        .do((res: Response) => {})
        .map((res: Response) => res.json())
        .catch((error: any) => {
            return Observable.throw(new Error(error.status));
        });
    }
    GetLeaveLocation(data)
    {
      this.accessToken = this.globalService.token_type+' '+this.globalService.access_token;
      let headers = new Headers();
        headers.append("Accept", 'application/json');
        headers.append("App-ID", this.constants.appid);
        headers.append("Authorization", this.accessToken);
      var url = this.constants.baseUrl + "activity/";
      return this.http.post(url,data,{headers: headers})
        .timeout(request_timeout)
        .do((res: Response) => {})
        .map((res: Response) => res.json())
        .catch((error: any) => {
            return Observable.throw(new Error(error.status));
        });
    }
    promotions(data)
    {
      this.accessToken = this.globalService.token_type+' '+this.globalService.access_token;
      let headers = new Headers();
        headers.append("Accept", 'application/json');
        headers.append("App-ID", this.constants.appid);
        headers.append("Authorization", this.accessToken);
      var url = this.constants.baseUrl + "redeemed-promotions/";
      return this.http.post(url,data,{headers: headers})
        .timeout(request_timeout)
        .do((res: Response) => {})
        .map((res: Response) => res.json())
        .catch((error: any) => {
          if(error.status == 0 && this.globalService.toastShow == false)
          {
            this.globalService.presentToast(this.globalService.connectivity);
          }
            return Observable.throw(new Error(error.status));
        });
    }

    get_promotions()
    {
      this.accessToken = this.globalService.token_type+' '+this.globalService.access_token;
      let headers = new Headers();
        headers.append("Accept", 'application/json');
        headers.append("App-ID", this.constants.appid);
        headers.append("Authorization", this.accessToken);
      var url = this.constants.baseUrl + "redeemed-promotions/";
      return this.http.get(url,{headers: headers})
        .timeout(request_timeout)
        .do((res: Response) => {})
        .map((res: Response) => res.json())
        .catch((error: any) => {
          if(error.status == 0 && this.globalService.toastShow == false)
          {
            this.globalService.presentToast(this.globalService.connectivity);
          }
            return Observable.throw(new Error(error.status));
        });
    }

    push_token(data)
    {
      this.accessToken = this.globalService.token_type+' '+this.globalService.access_token;
      let headers = new Headers();
        headers.append("Accept", 'application/json');
        headers.append("App-ID", this.constants.appid);
        headers.append("Authorization", this.accessToken);
      var url = this.constants.baseUrl + "users/me/set_push_id/";
      return this.http.post(url,data,{headers: headers})
        .timeout(request_timeout)
        .do((res: Response) => {})
        .map((res: Response) => res.json())
        .catch((error: any) => {
            return Observable.throw(new Error(error.status));
        });
    }
    Get_MenuList()
    {
        var url = this.constants.baseUrl + "menus/";
        return this.http.get(url)
        .timeout(request_timeout)
        .do((res: Response) => {})
        .map((res: Response) => res.json())
        .catch((error: any) => {
          if(error.status == 0 && this.globalService.toastShow == false)
          {
            this.globalService.presentToast(this.globalService.connectivity);
          }
            return Observable.throw(new Error(error.status));
        });
    }

    revoke_token(data)
    {
      this.accessToken = this.globalService.token_type+' '+ this.globalService.access_token;
      let headers = new Headers();
        headers.append("Accept", 'application/json');
        headers.append("App-ID", this.constants.appid);
      var url = this.constants.baseUrl + "o/token/";
      return this.http.post(url,data,{headers: headers})
        .timeout(request_timeout)
        .do((res: Response) => {})
        .map((res: Response) => res.json())
        .catch((error: any) => {
            return Observable.throw(new Error(error.status));
        });

    }

}
