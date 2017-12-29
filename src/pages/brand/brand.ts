import {Component, ViewChild, ElementRef} from '@angular/core';

import { NavController,NavParams, Platform,ModalController,AlertController,ToastController} from 'ionic-angular';

import { GlobalVarService } from '../../providers/constants/global-var';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { GoogleMapsProvider } from '../../providers/google-maps/google-maps';
import { Geolocation } from '@ionic-native/geolocation';
import { ApiServicesProvider } from "../../providers/api-services/api-services";
import { ConstantsProvider } from "../../providers/constants/constants";
import { HomePage } from "../home/home";
import { MerchantDetailsPage } from "../merchant-details/merchant-details";
import { DefaultPage } from "../default/default";
import { LoyaltyPage} from  '../loyalty/loyalty';
import { Network } from '@ionic-native/network';
import { IBeacon, IBeaconPluginResult } from '@ionic-native/ibeacon';
import { Diagnostic } from '@ionic-native/diagnostic';
import { ImgCacheService } from 'ng-imgcache';

@Component({
  selector: 'page-brand',
  templateUrl: 'brand.html'
})
export class BrandPage {

  @ViewChild('map') mapElement: ElementRef;
  @ViewChild('pleaseConnect') pleaseConnect: ElementRef;

  brand_name: string = '';
  brand_id :string = '';
  map_listview : number =0;
  list_view_show : number = 0;
  marker_val : number =0;
  openingtime : any;
  open_time : string = '';
  collect_time : number;

  merchant_data :any;
  merchant_name : any[] = [];
  DTime :any;
  DTime_merchant : Array<{}> = [];
  lat_long: Array<{}> = [];
  task_interval: any;
  menu_open : number = 0;
  carousel_1 : string = localStorage.getItem('carousel_1') || this.constants.carousel1;
  carousel_2 : string = localStorage.getItem('carousel_2') || this.constants.carousel2;
  carousel_3 : string = localStorage.getItem('carousel_3') || this.constants.carousel3;
  major_beconid : number = 0;
  minor_beconid : number = 0;
  data_leave_status : number = 0;
  merchant_length : number =0;
  merchantID : number ;
  userdata: any;
  walk_id : any ='';
  Loader_condition : boolean =false;
  internet_connection : boolean =true;
  call_next_page :any =0;

  constructor(public navCtrl: NavController, public globalService : GlobalVarService, private locationAccuracy: LocationAccuracy, public maps: GoogleMapsProvider, public platform: Platform,public navParams: NavParams, private geolocation: Geolocation, public apiservice: ApiServicesProvider, public constants: ConstantsProvider, public modalCtrl: ModalController, public network: Network ,public alertCtrl : AlertController,private ibeacon: IBeacon,private toastCtrl: ToastController,private diagnostic: Diagnostic,public imgCache: ImgCacheService) {
    this.globalService.menuShow = true;
    this.network.onConnect().subscribe(() => {
      console.log('network connected!');
      this.internet_connection = true;
      setTimeout(() => {
        if (this.network.type === 'wifi') {
          this.internet_connection = true;
          console.log('we got a wifi connection, woohoo!');
        }
    }, 3000);
  });
  }

  ibeaconFunction()
  {
      // Request permission to use location on iOS
      this.ibeacon.requestAlwaysAuthorization();
      this.ibeacon.enableDebugLogs();
      this.ibeacon.enableDebugNotifications();
      // create a new delegate and register it with the native layer
      let delegate = this.ibeacon.Delegate();
      // Subscribe to some of the delegate's event handlers
      setTimeout(()=>{
          this.ibeacon.isBluetoothEnabled().then(
          (data)=>{
          },
          (err)=>{console.log("blutooh Error"+err);}
          );
      },3000);
        delegate.didRangeBeaconsInRegion()
          .subscribe(
            (pluginResult: IBeaconPluginResult) => {
              console.log('didRangeBeaconsInRegion: ', JSON.stringify(pluginResult)+"log"+this.minor_beconid);
              var data_obj = pluginResult.beacons;
              if(data_obj)
              {
                if(this.minor_beconid == 0 && data_obj.length != 0)
                {
                  this.minor_beconid = data_obj[0].minor;
                  this.major_beconid = data_obj[0].major;
                  this.MerchantEnterApi();
                }
              }
              if(data_obj.length == 0 && this.data_leave_status == 0)
              {
                this.MerchantLeaveApi();
                this.data_leave_status=1;
                this.minor_beconid =0;
                this.major_beconid=0;
              }
            },
            error => console.error("didInRegion=====::::"+error)
          );
          this.ibeacon.isBluetoothEnabled();
          this.ibeacon.enableBluetooth();

      delegate.didStartMonitoringForRegion()
      .subscribe(
        (pluginResult: IBeaconPluginResult) => {
        },
        error => console.error(error)
      );
      delegate.didEnterRegion()
      .subscribe(
        (pluginResult: IBeaconPluginResult) => {
        },
        (err)=>{  console.log(err);}
      );

      delegate.didExitRegion()
      .subscribe(
        (pluginResult: IBeaconPluginResult) => {

        }
        ,(err)=>{  console.log("Exit minor error"+err);}
      );

      let getD = this.ibeacon.getDelegate();
      console.log(JSON.stringify(getD)+"getD");
      let beaconRegion = this.ibeacon.BeaconRegion('deskBeacon','c0261ddc-459c-418f-8c5b-ba572c114caa');
      //c0261ddc-459c-418f-8c5b-ba572c114caa
      //fda50693-a4e2-4fb1-afcf-c6eb07647825
      this.ibeacon.startMonitoringForRegion(beaconRegion)
      .then(
        (data) => console.log('Native layer recieved the request to monitoring'+data),
        error => console.error('Native layer failed to begin monitoring: '+ error));

      this.ibeacon.startRangingBeaconsInRegion(beaconRegion)
      .then(() => {
        console.log(`Started ranging beacon region: `, beaconRegion);
      })
      .catch((error: any) => {
        console.error(`Failed to start ranging beacon region: `, beaconRegion);
      });

      this.ibeacon.getMonitoredRegions().then(
        (data) => console.log('Native getMonitoredRegions'+data),
        error => console.error('Native getMonitoredRegions failed: '+ error));
  }

  ionViewWillEnter()
  {
    this.platform.ready().then(() => {
      this.network.onDisconnect().subscribe(() => {
        if(this.globalService.toastShow == false)
        {
          this.globalService.presentToast(this.globalService.connectivity);
          this.internet_connection = false;
        }
      });
      this.network.onConnect().subscribe(() => {
        console.log('network connected!');
        this.internet_connection = true;
        setTimeout(() => {
          if (this.network.type === 'wifi') {
            this.internet_connection = true;
            console.log('we got a wifi connection, woohoo!');
          }
        }, 3000);
      });
    });
    this.globalService.menuShow = true;
    setTimeout(()=>{
      this.globalService.headerShow = false;
    },500);
  }
  ionViewDidEnter()
  {
    if(!this.globalService.access_token)
    {
      if(this.globalService.oncetime == 0)
      {
        this.showModal();
        this.globalService.oncetime = 1;
      }
    }
  }

  ionViewDidLoad()
  {
    console.log('ionViewDidLoad Brandpage');
    console.log(this.globalService.access_token);
    if(this.globalService.access_token == null || this.globalService.access_token == '')
    {
      this.globalService.access_token='';
      this.globalService.profile_name='';
      this.globalService.avatar_url='';
      this.globalService.brand_id = 0;
    }
    if(localStorage.getItem('carousel_1'))
    {
      this.Loader_condition =true;
    }

    this.getUserApi();
    this.getBrandName();

    this.platform.ready().then(() => {
      this.network.onDisconnect().subscribe(() => {
        if(this.globalService.toastShow == false)
        {
          this.globalService.presentToast(this.globalService.connectivity);
          this.internet_connection = false;
        }
    });
    this.network.onConnect().subscribe(() => {
      console.log('network connected!');
      this.internet_connection = true;
      setTimeout(() => {
        if (this.network.type === 'wifi') {
          this.internet_connection = true;
          console.log('we got a wifi connection, woohoo!');
        }
    }, 3000);
  });

    this.imgCache.init();
    this.globalService.temp_page="Home";
    if (this.platform.is('cordova'))
    {
      this.ibeacon.isBluetoothEnabled();
      this.ibeacon.enableBluetooth();
      let successCallback = (isAvailable) => { console.log('Is available? ' + isAvailable); };
      let errorCallback = (e) => console.error(e);
      this.diagnostic.isBluetoothAvailable().then(successCallback, errorCallback);
      let checkI = setInterval(()=>{
      this.diagnostic.getBluetoothState()
        .then((state) => {
          if (state == this.diagnostic.bluetoothState.POWERED_ON){
            clearInterval(checkI);
            this.ibeaconFunction();
          }
        }).catch(e => console.error(e));
      },5000);
    }
    this.task_interval = setInterval(() => {
      if(localStorage.getItem('walk_screen') == '2')
      {
        this.geolocation.getCurrentPosition({ enableHighAccuracy: true, maximumAge: 100, timeout: 60000 }).then((resp) => {
           this.globalService.latitude  = resp.coords.latitude;
           this.globalService.longitude = resp.coords.longitude;
           localStorage.setItem('latitude',this.globalService.latitude);
           localStorage.setItem('longitude',this.globalService.longitude);
           clearInterval(this.task_interval);
          }).catch((error) => {
        });
      }
    }, 2000);
      if (this.platform.is('cordova')) {
      this.locationAccuracy.canRequest().then((canRequest: boolean) => {
        if(canRequest) {
          // the accuracy option will be ignored by iOS
          this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
            () => console.log('Request successful'),
            error => console.log('Error requesting location permissions', error)
          );
        }
      });
      if(localStorage.getItem('walk_screen') == '2')
      {
        let watch = this.geolocation.watchPosition();
        watch.subscribe((data) => {
         this.globalService.latitude  = data.coords.latitude;
         this.globalService.longitude = data.coords.longitude;
         localStorage.setItem('latitude',this.globalService.latitude);
         localStorage.setItem('longitude',this.globalService.longitude);
       });
      }
   }
      let mapLoaded = this.maps.init(this.mapElement.nativeElement, this.pleaseConnect.nativeElement);
      console.log(mapLoaded);
      Promise.all([
        mapLoaded
      ]).then((result) => {
        })
    });
  }

  ibeaconToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 10000,
      position: 'bottom',
      dismissOnPageChange: true
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }
  MerchantEnterApi()
  {
    var data_enter = {
      "activity": "entered_merchant_location",
      "extra_data": {
        "major": this.major_beconid,
        "minor": this.minor_beconid,
      }
    }
    this.apiservice.GetEnterLocation(data_enter).subscribe((data)=>{
      },(err) => {

      });
  }

  MerchantLeaveApi()
  {
    var data_leave = {
      "activity": "left_merchant_location",
      "extra_data": {
        "major": this.major_beconid,
        "minor": this.minor_beconid,
      }
    }
    this.apiservice.GetEnterLocation(data_leave).subscribe((data)=>{
      },(err) => {

      });
  }

  getBrandName()
  {
    if(this.Loader_condition == false)
    {
      this.globalService.showLoader();
    }
    this.apiservice.GetBrandName().subscribe((data)=>{
      this.brand_name = data.name;
      this.carousel_1 = data.carousel_1;
      localStorage.setItem("carousel_1",this.carousel_1);
      this.carousel_2= data.carousel_2;
      localStorage.setItem("carousel_2",this.carousel_2);
      this.carousel_3 = data.carousel_3;
      localStorage.setItem("carousel_3",this.carousel_3);
      this.globalService.brand_name = this.brand_name;
      this.brand_id = data.brands;
      this.globalService.brand_id = this.brand_id;
      let logo_small = data.logo_small;
      this.globalService.brand_logo = logo_small;
      localStorage.setItem('brand_logo',this.globalService.brand_logo);
      let contact = data.contact_phone
      this.globalService.contact_phone = contact;
      let email = data.contact_email;
      this.globalService.contact_email = email;
      if(this.Loader_condition == false)
      {
        this.globalService.hideLoader();
      }
        this.resturantList();
        this.brandOrderApi();
    },(err) => {
      if(this.Loader_condition == false)
      {
        this.globalService.hideLoader();
      }
    });
  }

  brandOrderApi()
  {
    this.apiservice.GetMerchantName(this.globalService.brand_id).subscribe((data)=>{
    this.merchant_length = data.merchants.length;
    localStorage.setItem('merchant_length',this.merchant_length+'');
    this.globalService.merchant_site = this.merchant_length;
    let merchant_data = data.merchants;
    localStorage.setItem('MerchantList',JSON.stringify(merchant_data));
      this.merchantID = merchant_data[0].id;
      let merchant_menu = merchant_data[0].menu;
      this.globalService.merchant_info = data.merchants[0];
      this.globalService.menuId = merchant_menu;
      if(data.reward_program)
      {
        this.globalService.rewards_brand = data.reward_program;
      }
      if(this.call_next_page == 1)
      {
          this.call_next_page =0;
          this.orderCollect();
      }
    },(err) => {

    });
  }

  orderCollect()
  {
    this.platform.ready().then(() => {
        this.network.onConnect().subscribe(() => {
          this.internet_connection = true;
        });
    });
    if(this.internet_connection == false)
    {
      this.globalService.presentToast(this.globalService.connectivity);
      return false;
    }
    else
    {
      if(!this.globalService.brand_id)
      {
        this.call_next_page=1;
        this.getBrandName();
      }
    }
    if(this.globalService.brand_id)
    {
      this.get_product_id();
    }
  }
  get_product_id()
  {
    var data_length = localStorage.getItem('merchant_length');
    if(data_length)
    {
      this.merchant_length = eval(data_length);
    }
    //this.globalService.presentToast("Brand id=="+this.globalService.brand_id+"==Merchant id"+this.merchantID);
    if(this.merchant_length == 0)
    {
      if(this.Loader_condition == false)
      {
        this.globalService.showLoader();
        this.globalService.loading.setContent('Please wait...');
      }
      this.apiservice.GetMerchantName(this.globalService.brand_id).subscribe((data)=>{
      this.merchant_length = data.merchants.length;
      let merchant_data = data.merchants;
      if(this.merchant_length <= 1)
      {
        this.merchantID = merchant_data[0].id;
        let merchant_menu = merchant_data[0].menu;
        this.globalService.merchant_info = data.merchants[0];
        this.globalService.menuId = merchant_menu;

        if(data.reward_program)
        {
          this.globalService.rewards_brand = data.reward_program;
        }
          if(this.internet_connection == true && !this.merchantID)
          {
            this.getBrandName();
          }
          else if(this.internet_connection == true && this.merchantID)
          {
            localStorage.setItem('supertab_selected','1');
            this.navCtrl.push(MerchantDetailsPage,{id: this.merchantID});
          }
          else
          {
            this.globalService.presentToast(this.globalService.connectivity);
          }
      }
      else
      {
        if(this.internet_connection == true)
        {
          localStorage.setItem('supertab_selected','0');
          this.navCtrl.push(HomePage);
        }
        else
        {
          this.globalService.presentToast(this.globalService.connectivity);
        }
      }
        if(this.Loader_condition == false)
        {
          this.globalService.hideLoader();
        }
      },(err) => {
        if(this.Loader_condition == false)
        {
          this.globalService.hideLoader();
        }
      });

    }else
    {
      if(this.merchant_length <= 1)
      {
        if(this.internet_connection == true && !this.merchantID)
        {
          this.getBrandName();
        }
        else if(this.internet_connection == true && this.merchantID)
        {
          localStorage.setItem('supertab_selected','1');
          this.navCtrl.push(MerchantDetailsPage,{id: this.merchantID});
        }
        else
        {
          this.globalService.presentToast(this.globalService.connectivity);
        }
      }
      else
      {
        if(this.internet_connection == true)
        {
          localStorage.setItem('supertab_selected','0');
          this.navCtrl.push(HomePage);
        }
        else
        {
          this.globalService.presentToast(this.globalService.connectivity);
        }
      }
    }
  }

  getUserApi()
  {
    this.apiservice.get_user_id().subscribe((data)=>{
      var data_response = data;
      this.globalService.user_id = data_response.id;
      this.globalService.card_info = data_response.card;
      this.globalService.avatar_url = data_response.avatar_url;
      this.globalService.profile_name = data_response.name;
    },(err)=>{
      console.log("TOKEn"+err);
      if(err.message == 401)
      {
        this.revoke_token();
      }
      //this.globalService.access_token='';
      //this.globalService.profile_name='';
      //this.globalService.avatar_url='';
    });
  }

  revoke_token()
  {
      var data = {
    "client_id": this.constants.client_id,
     "client_secret": this.constants.client_secret,
     "grant_type": "refresh_token",
     "refresh_token": localStorage.getItem('refresh_token')
   }
    this.apiservice.revoke_token(data).subscribe((data)=>{

      this.userdata = data;
      localStorage.setItem('access_token',this.userdata.access_token);
      localStorage.setItem('refresh_token',this.userdata.refresh_token);
      localStorage.setItem('token_type',this.userdata.token_type);
      this.globalService.access_token = this.userdata.access_token;
      this.globalService.token_type = this.userdata.token_type;
      this.getUserApi();
    },(err)=>{
      this.globalService.access_token='';
      localStorage.removeItem('access_token');
    });
  }

  grid_view()
  {
    this.list_view_show =0;
  }

  List_view()
  {
  this.maps.init(this.mapElement.nativeElement, this.pleaseConnect.nativeElement);
  //console.log("List view");
    this.list_view_show =1;
    //let locations = this.globalService.map_merchant;
    //console.log(JSON.stringify(locations) +"location **************&&");
    /*for (let location of locations) {
      this.maps.addMarker(location.lat, location.long);
    }
    setTimeout(()=>{
      this.collect_time = Math.floor(locations[0].waiting_time/60);
    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var d = new Date();
    var dayName = days[d.getDay()];

      this.openingtime = locations[0].opening_times;

      let Fday_time = this.openingtime[dayName.toLowerCase()][0];
      console.log(Fday_time+"**(*(&(&&())))");
      let Ftime_split = Fday_time.split(':');
      let Ftim = Ftime_split[0]+':'+Ftime_split[1];

      let Tday_time = this.openingtime[dayName.toLowerCase()][1];
      let Ttime_split = Tday_time.split(':');
      let Ttim = Ttime_split[0]+':'+Ttime_split[1];
      this.open_time = Ftim+' - '+Ttim;

      this.marker_show(locations[0].lat, locations[0].long, 0, this.collect_time, this.open_time)
    },500);*/
  }

  markerShow(lat, long, i , collect_time, open_time)
  {
    let locations = this.globalService.map_merchant;
  //  for (let location of locations) {
    //.log(location.lat == lat+"location");
      this.maps.addMarker(lat, long);
    //}
    let val_mark = this.marker_val;
    document.getElementById("marker_"+val_mark).style.color = "black";
    document.getElementById("marker_"+i).style.color = "red";
    this.marker_val=i;

    this.collect_time = Math.floor(locations[i].waiting_time/60);

  var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var d = new Date();
  var dayName = days[d.getDay()];

    this.openingtime = locations[i].opening_times;

    let Fday_time = this.openingtime[dayName.toLowerCase()][0];
  //  console.log(Fday_time+"**(*(&(&&())))");
    let Ftime_split = Fday_time.split(':');
    let Ftim = Ftime_split[0]+':'+Ftime_split[1];

    let Tday_time = this.openingtime[dayName.toLowerCase()][1];
    let Ttime_split = Tday_time.split(':');
    let Ttim = Ttime_split[0]+':'+Ttime_split[1];
    this.open_time = Ftim+' - '+Ttim;
  }


  resturantList(){
    this.apiservice.GetMerchantName(this.brand_id).subscribe((data)=>{
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
      localStorage.setItem('MerchantList',JSON.stringify(this.merchant_name));
      this.DistanceTime(this.walk_id);
      this.globalService.rewards_brand = data.reward_program;
      this.globalService.MerchantList = this.merchant_name;
      this.globalService.map_merchant = this.merchant_name;
      let dat_RWD = data.reward_program;
      if(dat_RWD)
      {
        localStorage.setItem('Reward_program',JSON.stringify(dat_RWD));
        this.globalService.rewards_brand = data.reward_program;
      }
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

  merchantDetailsPage(merchant_id, menuId,MD)
  {
    this.globalService.merchant_info = MD;
    this.globalService.menuId = menuId;
    this.navCtrl.push(MerchantDetailsPage,{id: merchant_id});
    setTimeout(()=>{
      this.list_view_show =0;
      },500);
  }

  loyalityPage()
  {
    if(this.globalService.access_token)
    {
      this.navCtrl.push(LoyaltyPage,{brand_id : this.brand_id});
    }
    else
    {
      this.globalService.presentToast('Please First Login.')
    }
  }

  showModal() {
      let modal = this.modalCtrl.create(DefaultPage);
      modal.onDidDismiss(data => {
          console.log('page > modal dismissed > data > ', data);
          if(data){

          }
      })
      modal.present();
  }

  ionViewWillLeave()
  {
    this.menuListStore();
    this.globalService.menuShow = false;
    this.globalService.headerShow = true;
  }

  menuListStore()
  {
    this.apiservice.Get_MenuList().subscribe((data)=>{
      let res = data;
      var Result = res.results;
      localStorage.setItem('MenuList',JSON.stringify(Result));
    });
  }

}
