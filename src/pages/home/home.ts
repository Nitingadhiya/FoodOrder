import {Component, ViewChild, ElementRef} from '@angular/core';

import {NavController, NavParams, Platform, Content} from 'ionic-angular';
//ViewController

import { GlobalVarService } from '../../providers/constants/global-var';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
//import { LocationsProvider } from '../../providers/locations/locations';
import { GoogleMapsProvider } from '../../providers/google-maps/google-maps';
import { Geolocation } from '@ionic-native/geolocation';

import { MerchantDetailsPage } from "../merchant-details/merchant-details";
import { ApiServicesProvider } from "../../providers/api-services/api-services";
import { ConstantsProvider } from "../../providers/constants/constants";
//import { FavouritesDetailsPage} from  '../favourites-details/favourites-details';
//import { ReceiptsDetailsPage} from  '../receipts-details/receipts-details';
import {SuperTabs} from "../../ionic2-super-tabs/src/components/super-tabs";
import { MerchantPage} from  '../merchant/merchant';
import { FavouritesPage } from '../favourites/favourites';
import { ReceiptsPage } from '../receipts/receipts';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

    @ViewChild(SuperTabs) superTabs: SuperTabs;
    page1: any = MerchantPage;
    page2: any = FavouritesPage;
    page3: any = ReceiptsPage;


 @ViewChild(Content) content: Content;
  @ViewChild('map') mapElement: ElementRef;
  @ViewChild('pleaseConnect') pleaseConnect: ElementRef;


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
  supertab_selected : any;
  supertab_selected_two :any;

  constructor(public navCtrl: NavController, public globalService : GlobalVarService, public maps: GoogleMapsProvider, public platform: Platform, private geolocation: Geolocation, public navParams: NavParams, public locationAccuracy : LocationAccuracy,public apiservice: ApiServicesProvider, public constants: ConstantsProvider) { //,public viewCtrl: ViewController

  }

  ionViewWillLeave()
  {
    this.globalService.menuShow = true;
    this.globalService.headerShow = true;
  }
  ionViewDidLoad() {
      console.log('ionViewDidLoad Homepage');
    this.platform.ready().then(() => {
      if (this.platform.is('cordova')) {
      this.locationAccuracy.canRequest().then((canRequest: boolean) => {

        if(canRequest) {
          // the accuracy option will be ignored by iOS
          this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
            () => console.log('Request successful'),
            error => console.log('Error requesting location permissions', error)
          );
        }

      })
      let watch = this.geolocation.watchPosition();
      watch.subscribe((data) => {
       this.globalService.latitude  = data.coords.latitude;
       this.globalService.longitude = data.coords.longitude;
       localStorage.setItem('latitude',this.globalService.latitude+'');
       localStorage.setItem('longitude',this.globalService.longitude+'');

     });
   }

    let mapLoaded = this.maps.init(this.mapElement.nativeElement, this.pleaseConnect.nativeElement);
    Promise.all([
      mapLoaded
    ]).then((result) => {
    })
  });
      this.getBrandName();
  }
  slideToIndex(index : number) {
    this.superTabs.slideTo(index);
  }

  getBrandName()
  {
    this.apiservice.GetBrandName().subscribe((data)=>{
      this.brand_name = data.brands;
      this.resturantList();
    },(err) => {
    });
  }

  onTabSelect(tab: { index: number; id: string; }) {
    console.log(`Selected tab: `, tab);
    console.log(tab.index);
    if(tab.index == 1 || tab.index == 2)
    {
        this.map_listview =1;
    }
    if(tab.index == 0 )
    {
      if(this.supertab_selected == 0)
      {
        this.map_listview =0;
      }
    }
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
          this.merchant_name.push({'address':this.merchant_data[i].address,'backgroud':this.merchant_data[i].background,'block_length':this.merchant_data[i].block_length,'cuisine':this.merchant_data[i].cuisine,'email':this.merchant_data[i].email,'id':this.merchant_data[i].id,'is_open':this.merchant_data[i].is_open,'lat':this.merchant_data[i].lat,'location_short':this.merchant_data[i].location_short,'logo':this.merchant_data[i].logo,'long':this.merchant_data[i].long,'manager_user':this.merchant_data[i].manager_user,'menu':this.merchant_data[i].menu,'name':this.merchant_data[i].name,'opening_times':this.merchant_data[i].opening_times,'orders_per_block':this.merchant_data[i].orders_per_block,'phone_number':this.merchant_data[i].phone_number,'staff_user':this.merchant_data[i].staff_user,'status':this.merchant_data[i].status,'waiting_time':this.merchant_data[i].waiting_time,'duration':'-'});

          if(this.walk_id)
          {
            this.walk_id +=","+this.merchant_data[i].id;
          }
          else
          {
            this.walk_id =this.merchant_data[i].id;
          }
        }
        this.distanceTime(this.walk_id);
        this.globalService.rewards_brand = data.reward_program;
        this.globalService.MerchantList = this.merchant_name;
        this.globalService.map_merchant = this.merchant_name;
        this.card_height = (this.globalService.device_height/2)-70+"px";
      },(err) => {

        });
  }

  distanceTime(walk_id)
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
        for (var key in data) {
          if(data[key].walking_time)
          {
            text = data[key].walking_time.text;
            for(var j=0;j<this.merchant_name.length;j++)
            {
              if(this.merchant_name[j].id == data[key].merchant)
              {
                this.merchant_name[j].duration = text;
              }
            }
          }
        }
          localStorage.setItem('MerchantList',JSON.stringify(this.merchant_name));
    },(err)=>{

    })
  }

  ListView()
  {
  this.maps.init(this.mapElement.nativeElement, this.pleaseConnect.nativeElement);
  console.log("List view");
    this.list_view_show =1;
    let locations = this.globalService.map_merchant;
      this.maps.addMarker(locations[0].lat, locations[0].long);

    setTimeout(()=>{
    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var d = new Date();
    var dayName = days[d.getDay()];

      this.openingtime = locations[0].opening_times;

      let Fday_time = this.openingtime[dayName.toLowerCase()][0];
      let Ftime_split = Fday_time.split(':');
      let Ftim = Ftime_split[0]+':'+Ftime_split[1];

      let Tday_time = this.openingtime[dayName.toLowerCase()][1];
      let Ttime_split = Tday_time.split(':');
      let Ttim = Ttime_split[0]+':'+Ttime_split[1];
      this.open_time = Ftim+' - '+Ttim;

      this.markerShow(locations[0].lat, locations[0].long, 0, locations[0].duration, this.open_time)
    },500);
  }
ionViewWillEnter()
{
  let merchant= localStorage.getItem('MerchantList');
  if(merchant)
  {
    this.merchant_name = JSON.parse(merchant);
    this.card_height = (this.globalService.device_height/2)-70+"px";
    this.load_more=true;
  }
  let compt_name= this.navCtrl.last();
  console.log(compt_name.component.name+"Component");

  if(compt_name.component.name == "FavouritesDetailsPage")
  {
    this.data_offset=0;
    this.load_more =true;
  }
  this.supertab_selected = localStorage.getItem('supertab_selected') || '0';
  if(this.supertab_selected > 0)
  {
    this.supertab_selected_two = this.supertab_selected - 1;
    if(this.globalService.recipe_page == true)
    {
      this.supertab_selected_two = 1;
      this.globalService.recipe_page =false;
    }
  }
  else
  {
    if(this.globalService.recipe_page == true)
    {
      this.supertab_selected_two = 2;
      this.globalService.recipe_page =false;
      this.map_listview =1;
    }
  }

  if(this.supertab_selected != 0)
  {
    this.map_listview =1;
  }
  this.globalService.menuShow = false;
  setTimeout(()=>{
    this.globalService.headerShow = false;
  },this.globalService.navigationTime);
}


  markerShow(lat, long, i , duration_time, open_time)
  {
    let locations = this.globalService.map_merchant;
      this.maps.addMarker(lat, long);
    let val_mark = this.marker_val;
    document.getElementById("markerH_"+val_mark).style.color = "grey";
    document.getElementById("markerH_"+i).style.color = "red";
    this.marker_val=i;

    this.duration_time = locations[i].duration;

  var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var d = new Date();
  var dayName = days[d.getDay()];

    this.openingtime = locations[i].opening_times;

    let Fday_time = this.openingtime[dayName.toLowerCase()][0];
    let Ftime_split = Fday_time.split(':');
    let Ftim = Ftime_split[0]+':'+Ftime_split[1];

    let Tday_time = this.openingtime[dayName.toLowerCase()][1];
    let Ttime_split = Tday_time.split(':');
    let Ttim = Ttime_split[0]+':'+Ttime_split[1];
    this.open_time = Ftim+' - '+Ttim;
  }

  gridView()
  {
    this.list_view_show =0;
  }

  merchantDetails(merchant_id, menuId,MD)
  {
    this.globalService.merchant_info = MD;
    this.globalService.menuId = menuId;

    this.navCtrl.push(MerchantDetailsPage,{id: merchant_id});
    setTimeout(()=>{
      this.list_view_show =0;
      },500);
  }

  backButtonClick()
  {
    this.navCtrl.pop();
  }
}
