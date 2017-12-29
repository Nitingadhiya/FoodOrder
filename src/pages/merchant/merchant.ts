import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ApiServicesProvider } from "../../providers/api-services/api-services";
import { GlobalVarService } from '../../providers/constants/global-var';
import { ConstantsProvider } from "../../providers/constants/constants";
import { MerchantDetailsPage } from "../merchant-details/merchant-details";

@Component({
  selector: 'page-home',
  templateUrl: 'merchant.html',
})
export class MerchantPage {
  map_listview : number =0;
  list_view_show : number = 0;
  marker_val : number =0;
  openingtime : any;
  open_time : string = '';
  duration_time : number;

  data_limit :number = 0;
  brand_name :string = '';
  merchant_data :any;
  merchant_name : any[] = [];
  DTime :any;
  DTime_merchant : Array<{}> = [];
  lat_long: Array<{}> = [];

  data_offset :number =0;
  load_more = false;
  favourites : any[] = [];
  favourites_local : any[] = [];
  data_favourites : any[] = [];
  data_not_found : string='';
  data_Favourites_url : String ='';

  Receipts : any[] = [];
  Receipts_local : any[] = [];
  data_Receipts : any[] = [];
  data_Receipts_url : String ='';

  merchant_list_array : any[]=[];
  card_height : string = '100px';
  walk_id : any ='';
  slide_height : string ='300px';
  rootNavCtrl: NavController;
  constructor(public navCtrl: NavController, public navParams: NavParams, public globalService : GlobalVarService ,public apiservice: ApiServicesProvider, public constants: ConstantsProvider) {
    this.rootNavCtrl = navParams.get('rootNavCtrl');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
    if(this.globalService.recipe_page == true)
    {
      this.load_more=true;
    }
    let merchant= localStorage.getItem('MerchantList');
    if(merchant)
    {
      this.merchant_name = JSON.parse(merchant);
      console.log(this.merchant_name);
      this.card_height = (this.globalService.device_height/2)-70+"px";
      this.load_more=true;
    }
    this.getBrandName();
  }
  getBrandName()
  {

    this.apiservice.GetBrandName().subscribe((data)=>{
      this.brand_name = data.brands;
      this.resturantList();
    },(err) => {

    });
  }
  resturantList(){
    this.card_height = (this.globalService.device_height/2)-70+"px";
      this.slide_height = (this.globalService.device_height)-70+"px";

    this.apiservice.GetMerchantName(this.brand_name).subscribe((data)=>{
        this.merchant_data = data.merchants;

        this.merchant_name=[];
          this.lat_long=[];
        for(var i = 0;i<this.merchant_data.length;i++)
        {
          this.merchant_name.push({'address':this.merchant_data[i].address,'background':this.merchant_data[i].background,'block_length':this.merchant_data[i].block_length,'cuisine':this.merchant_data[i].cuisine,'email':this.merchant_data[i].email,'id':this.merchant_data[i].id,'is_open':this.merchant_data[i].is_open,'lat':this.merchant_data[i].lat,'location_short':this.merchant_data[i].location_short,'logo':this.merchant_data[i].logo,'long':this.merchant_data[i].long,'manager_user':this.merchant_data[i].manager_user,'menu':this.merchant_data[i].menu,'name':this.merchant_data[i].name,'opening_times':this.merchant_data[i].opening_times,'orders_per_block':this.merchant_data[i].orders_per_block,'phone_number':this.merchant_data[i].phone_number,'staff_user':this.merchant_data[i].staff_user,'status':this.merchant_data[i].status,'waiting_time':this.merchant_data[i].waiting_time,'duration':'-','distance':'-'});

          if(this.walk_id)
          {
            this.walk_id +=","+this.merchant_data[i].id;
          }
          else
          {
            this.walk_id =this.merchant_data[i].id;
          }

        }
        this.DistanceTime(this.walk_id);
        this.globalService.rewards_brand = data.reward_program;
        this.globalService.MerchantList = this.merchant_name;
        this.globalService.map_merchant = this.merchant_name;
        this.card_height = (this.globalService.device_height/2)-70+"px";
      },(err) => {

        });
  }

  DistanceTime(walk_id)
  {
    var id = walk_id;
    var lat= this.globalService.latitude;
    if(!lat)
    {
      lat = localStorage.getItem('latitude');
    }
    var long = this.globalService.longitude;
    if(!long)
    {
      long = localStorage.getItem('longitude');
    }

    this.apiservice.walking_times(id,lat,long).subscribe((result)=>{
      var data = result;
      var text='';
      var text1='';
        for (var key in data) {
          if(data[key].walking_time)
          {
            text = data[key].walking_time.distance.text;
            text1 = data[key].walking_time.duration.text;
            for(var j=0;j<this.merchant_name.length;j++)
            {
              if(this.merchant_name[j].id == data[key].merchant)
              {
                this.merchant_name[j].duration = text1;
                this.merchant_name[j].distance = text;
              }
            }
          }
        }
          localStorage.setItem('MerchantList',JSON.stringify(this.merchant_name));
    },(err)=>{

    })
  }
  merchantDetails(merchant_id, menuId,MD)
  {
    this.globalService.merchant_info = MD;
    this.globalService.menuId = menuId;
    console.log(this.globalService.menuId+"MENU*");
    this.rootNavCtrl.push(MerchantDetailsPage,{id: merchant_id});
    setTimeout(()=>{
      this.list_view_show =0;
      },500);
  }
}
