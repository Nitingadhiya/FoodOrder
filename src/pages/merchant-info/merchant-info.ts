import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams , Platform} from 'ionic-angular';
import { ApiServicesProvider } from "../../providers/api-services/api-services";
import { GlobalVarService } from '../../providers/constants/global-var';
import { ConstantsProvider } from "../../providers/constants/constants";
import { InAppBrowser } from '@ionic-native/in-app-browser';

declare var google;

@Component({
  selector: 'page-merchant-info',
  templateUrl: 'merchant-info.html',
})
export class MerchantInfoPage {
  menu_name : Array<{}> = [];
  product_name :Array<{}> =[];
  openingtime :any;
  open_time :string = '';

  @ViewChild('map') mapElement: ElementRef;
  map: any;


  Fweek_day1 :string =''; Tweek_day1 :string ='';
  Fweek_day2 :string =''; Tweek_day2 :string ='';
  Fweek_day3 :string =''; Tweek_day3 :string ='';
  Fweek_day4 :string =''; Tweek_day4 :string ='';
  Fweek_day5 :string =''; Tweek_day5 :string ='';
  Fweek_day6 :string =''; Tweek_day6 :string ='';
  Fweek_day7 :string =''; Tweek_day7 :string ='';

  week_opentime : number = 0;
  Get_dayName : string = '';
  platform_name : string = '';
  merchant_address :string = '';
  merchant_latitude : any ='';
  merchant_longitude : any='';

  constructor(public navCtrl: NavController, public navParams: NavParams, public globalService : GlobalVarService ,public apiservice: ApiServicesProvider, public constants: ConstantsProvider, private iab: InAppBrowser,public platform: Platform) {

    platform.ready().then(() => {
      if (this.platform.is('android')) {
        this.platform_name = "android";
      }
      if (this.platform.is('ios')) {
          this.platform_name = "ios";
      }
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Merchant info page');
    setTimeout(()=>{
      this.loadMap();
    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var d = new Date();
    var dayName = days[d.getDay()];
    this.Get_dayName = dayName.toLowerCase();

    this.openingtime = this.globalService.merchant_info.opening_times;
    if(this.openingtime[dayName.toLowerCase()].length > 0)
    {
      let Fday_time = this.openingtime[dayName.toLowerCase()][0];
      let Ftime_split = Fday_time.split(':');
      let Ftim = Ftime_split[0]+':'+Ftime_split[1];

      let Tday_time = this.openingtime[dayName.toLowerCase()][1];
      let Ttime_split = Tday_time.split(':');
      let Ttim = Ttime_split[0]+':'+Ttime_split[1];
      this.open_time = Ftim+' - '+Ttim;
    }
    },1500);
  }


  loadMap(){
    let lat = this.globalService.merchant_info.lat || '21.8392';
    let long = this.globalService.merchant_info.long || '72.1246';

   let latLng = new google.maps.LatLng(eval(lat), eval(long));

   let mapOptions = {
     center: latLng,
     zoom: 8,
     mapTypeId: google.maps.MapTypeId.ROADMAP
   }

   this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
   this.addMarker();

 }

 addMarker(){
 var icon = {
   url: "assets/images/MapMarker_Bal.png",
   scaledSize: new google.maps.Size(40, 40), // scaled size
   origin: new google.maps.Point(0,0), // origin
   anchor: new google.maps.Point(0, 0) // anchor
};
  let marker = new google.maps.Marker({
    map: this.map,
    animation: google.maps.Animation.DROP,
    position: this.map.getCenter(),
    icon: icon,
  });

}

  openingHours()
  {
    if(this.week_opentime == 0)
    {
      this.week_opentime = 1;
    }
    else
    {
      this.week_opentime = 0;
      return false;
    }
    if(this.openingtime)
    {
    if(this.openingtime['monday'].length > 0)
    {
      let Fday_time = this.openingtime['monday'][0];
      let Ftime_split = Fday_time.split(':');
      this.Fweek_day1 = Ftime_split[0]+':'+Ftime_split[1];

      let Tday_time = this.openingtime['monday'][1];
      let Ttime_split = Tday_time.split(':');
      this.Tweek_day1 = Ttime_split[0]+':'+Ttime_split[1];
    }
    if(this.openingtime['tuesday'].length > 0)
    {
      let Fday_time = this.openingtime['tuesday'][0];
      let Ftime_split = Fday_time.split(':');
      this.Fweek_day2 = Ftime_split[0]+':'+Ftime_split[1];

      let Tday_time = this.openingtime['tuesday'][1];
      let Ttime_split = Tday_time.split(':');
      this.Tweek_day2 = Ttime_split[0]+':'+Ttime_split[1];
    }
    if(this.openingtime['wednesday'].length > 0)
    {
      let Fday_time = this.openingtime['wednesday'][0];
      let Ftime_split = Fday_time.split(':');
      this.Fweek_day3 = Ftime_split[0]+':'+Ftime_split[1];

      let Tday_time = this.openingtime['wednesday'][1];
      let Ttime_split = Tday_time.split(':');
      this.Tweek_day3 = Ttime_split[0]+':'+Ttime_split[1];
    }
    if(this.openingtime['thursday'].length > 0)
    {
      let Fday_time = this.openingtime['thursday'][0];
      let Ftime_split = Fday_time.split(':');
      this.Fweek_day4 = Ftime_split[0]+':'+Ftime_split[1];

      let Tday_time = this.openingtime['thursday'][1];
      let Ttime_split = Tday_time.split(':');
      this.Tweek_day4 = Ttime_split[0]+':'+Ttime_split[1];
    }
    if(this.openingtime['friday'].length > 0)
    {
      let Fday_time = this.openingtime['friday'][0];
      let Ftime_split = Fday_time.split(':');
      this.Fweek_day5 = Ftime_split[0]+':'+Ftime_split[1];

      let Tday_time = this.openingtime['friday'][1];
      let Ttime_split = Tday_time.split(':');
      this.Tweek_day5 = Ttime_split[0]+':'+Ttime_split[1];
    }
    if(this.openingtime['saturday'].length > 0)
    {
      let Fday_time = this.openingtime['saturday'][0];
      let Ftime_split = Fday_time.split(':');
      this.Fweek_day6 = Ftime_split[0]+':'+Ftime_split[1];

      let Tday_time = this.openingtime['saturday'][1];
      let Ttime_split = Tday_time.split(':');
      this.Tweek_day6 = Ttime_split[0]+':'+Ttime_split[1];
    }
    if(this.openingtime['sunday'].length > 0)
    {
      let Fday_time = this.openingtime['sunday'][0];
      let Ftime_split = Fday_time.split(':');
      this.Fweek_day7 = Ftime_split[0]+':'+Ftime_split[1];

      let Tday_time = this.openingtime['sunday'][1];
      let Ttime_split = Tday_time.split(':');
      this.Tweek_day7 = Ttime_split[0]+':'+Ttime_split[1];
    }
    }
  }

  launchApp()
  {
    this.merchant_address = this.globalService.merchant_info.address;
    this.merchant_latitude = this.globalService.merchant_info.lat;
    this.merchant_longitude = this.globalService.merchant_info.long;
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
