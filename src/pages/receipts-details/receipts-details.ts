import {Component} from '@angular/core';

import {NavController, ModalController, NavParams, Platform} from 'ionic-angular';

import { ApiServicesProvider } from "../../providers/api-services/api-services";
import { GlobalVarService } from '../../providers/constants/global-var';
import { ConstantsProvider } from "../../providers/constants/constants";
import { InAppBrowser } from '@ionic-native/in-app-browser';

@Component({
  selector: 'page-receipts-details',
  templateUrl: 'receipts-details.html'
})
export class ReceiptsDetailsPage {

  receipts_id : number = 0;
  data_Receipts_Details : any[] =[];
  data_user :any[] = [];
  varation_temp :any='';
  line_items : Array<{}>=[];

  merchant_address :String = '';
  merchant_name :String ='';
  merchant_data :any;
  merchant_latitude : any ='';
  merchant_longitude : any='';
  platform_name : string = '';
  added_item : number =0;

  constructor(public navCtrl: NavController, public globalService : GlobalVarService, public constants: ConstantsProvider, public modalCtrl: ModalController, public navParams : NavParams, public apiservice: ApiServicesProvider, private iab: InAppBrowser,public platform: Platform) {
    this.receipts_id = this.navParams.get('id');
    platform.ready().then(() => {
      if (this.platform.is('android')) {
        this.platform_name = "android";
      }
      if (this.platform.is('ios')) {
          this.platform_name = "ios";
      }
    });
  }
  back_page()
  {
    this.navCtrl.pop();
  }

  ionViewWillLeave()
  {
    this.globalService.menuShow = false;
    this.globalService.headerShow = true;
    this.globalService.recipe_page = false;
  }
  ionViewWillEnter()
  {
    this.globalService.menuShow = false;
    setTimeout(()=>{
      this.globalService.headerShow = false;
    },this.globalService.navigationTime);
  }
  ionViewDidLoad()
  {
    console.log('ionViewDidLoad ReceiptsDetailsPage');
    this.receipts_details();
  }

  receipts_details()
  {
    this.globalService.showLoader();
    this.apiservice.Get_receipts_details(this.receipts_id).subscribe((data)=>{

      //this.globalService.presentToast('Get Receipts Details Successfully.');
      this.data_Receipts_Details = data;
      if(this.data_Receipts_Details)
      {
        this.data_user.push(this.data_Receipts_Details);
      }

      this.merchant_data = this.data_Receipts_Details;
      for(let merchant_list of this.globalService.MerchantList)
      {
        if(this.merchant_data.merchant == merchant_list.id)
        {
          this.merchant_name = merchant_list.name;
          this.merchant_address = merchant_list.address;
          this.merchant_latitude = merchant_list.lat;
          this.merchant_longitude = merchant_list.long;
        }
      }


      this.varation_temp = this.data_Receipts_Details;
      this.line_items = this.varation_temp.line_items;
      /*var variation = this.varation_temp.line_items[0].variation_string;
      var splitV = variation.split(',');
      for(var j=0;j<splitV.length;j++)
      {
        this.variation_string.push(splitV[j]);
      }*/

        this.globalService.hideLoader();
    },(err) => {
      this.globalService.hideLoader();
      var msg = JSON.parse(err.message);
      if(msg.detail)
      {
        //this.globalService.presentToast(msg.detail);
      }
      else
      {
        //this.globalService.presentToast('Get Receipts Details Error.');
      }

    });
  }

  add_to_favourite(related_order, merchant, line_items)
  {
    this.globalService.showLoader();
    var data=
    {
      "related_order": related_order,
      "merchant": merchant,
      "favourite_items": line_items
    }
    this.apiservice.Add_Favourite(data).subscribe((data)=>{
      this.added_item =1;
        this.globalService.hideLoader();
    },(err) => {
        this.globalService.hideLoader();
    });
  }

  direction_app()
  {
    if(this.platform_name == "ios")
    {
      this.iab.create('maps://'+this.merchant_latitude+','+this.merchant_longitude+'?q='+this.merchant_address,'_system',{location:'yes'});
    }
    else
    {
      this.iab.create('geo:'+this.merchant_latitude+','+this.merchant_longitude+'?q='+this.merchant_address,'_system',{location:'yes'});
    }
  }

}
