import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ApiServicesProvider } from "../../providers/api-services/api-services";
import { GlobalVarService } from '../../providers/constants/global-var';
import { ConstantsProvider } from "../../providers/constants/constants";
import { ReceiptsDetailsPage} from  '../receipts-details/receipts-details';



@Component({
  selector: 'page-receipts',
  templateUrl: 'receipts.html',
})
export class ReceiptsPage {

  data_offset :number =0;
    Receipts : any[] = [];
    Receipts_local : any[] = [];
    data_Receipts : any[] = [];
    data_Receipts_url : String ='';
  rootNavCtrl: NavController;
  load_more :boolean =false;
  data_not_found :string ='';

  constructor(public navCtrl: NavController, public navParams: NavParams, public globalService : GlobalVarService ,public apiservice: ApiServicesProvider, public constants: ConstantsProvider) {
this.rootNavCtrl = navParams.get('rootNavCtrl');
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad ReceiptsPage');
    let RC_data = localStorage.getItem('ReceiptsList');
    if(RC_data)
    {
      this.Receipts_local = JSON.parse(RC_data);
      this.load_more =true;
    }
    this.Get_order_receipts(this.globalService.data_limit, this.data_offset,'');
  }

  /* Get Recipe code*/
  Get_order_receipts(limit, offset, data_Receipts_url)
  {
    if(!this.globalService.access_token)
    {
        return false;
    }
    if(this.load_more == false  && !localStorage.getItem('temp_load'))
    {
      localStorage.setItem('temp_load','1');
      this.globalService.showLoader();
    }
    this.apiservice.Get_receipts(limit, offset, data_Receipts_url).subscribe((data)=>{

      this.data_Receipts = data.results;
      this.data_Receipts_url = data.next;
      if(this.data_Receipts.length == 0)
      {
        this.data_not_found='No Items found';
      }
      if(this.load_more == false)
      {
        setTimeout(()=>{
          this.globalService.hideLoader();
        },1200);
      }

      for(var i=0;i<this.data_Receipts.length;i++)
      {
        var temp_merchant = '';
        for(let merchant_list of this.globalService.MerchantList)
        {
          if(this.data_Receipts[i].merchant == merchant_list.id)
          {
            temp_merchant = merchant_list.name;
          }
        }
        this.Receipts.push({'merchant_name':temp_merchant,'receipts_id':this.data_Receipts[i].id,'customer_name':this.data_Receipts[i].user.name,'order_id':this.data_Receipts[i].collection_code,'collection_time':this.data_Receipts[i].collection_time,'total':this.data_Receipts[i].total,'product':this.data_Receipts[i].line_items[0].quantity});
        localStorage.setItem('ReceiptsList',JSON.stringify(this.Receipts));
        this.Receipts_local = this.Receipts;

      }
    },(err) => {
      if(this.load_more == false)
      {
        this.globalService.hideLoader();
      }
    });
  }

  receipts_details(id)
  {
    this.rootNavCtrl.push(ReceiptsDetailsPage,{'id':id});
  }
  /* Get Recipe code*/
  doInfinite(infiniteScroll)
  {
     console.log('Begin async operation');
     this.load_more =true;
      this.data_offset+=10;
        if(this.data_Receipts_url == null)
        {
          infiniteScroll.complete();
          return false;
        }
        this.Get_order_receipts(this.globalService.data_limit, this.data_offset, this.data_Receipts_url);

     setTimeout(() => {
       console.log('Async operation has ended');
       infiniteScroll.complete();
     }, 1500);
  }
  ionViewWillLeave()
  {
    localStorage.removeItem('temp_load');
  }
}
