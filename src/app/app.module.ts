import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { ConstantsProvider } from '../providers/constants/constants';
import { ApiServicesProvider } from '../providers/api-services/api-services';
import { GlobalVarService } from '../providers/constants/global-var';
import { HttpModule } from '@angular/http';
import { SuperTabsModule } from '../ionic2-super-tabs/src';
import { GoogleMapsProvider } from '../providers/google-maps/google-maps';
import { Network } from '@ionic-native/network';
import { Geolocation } from '@ionic-native/geolocation';
import { ConnectivityProvider } from '../providers/connectivity/connectivity';

import { MyApp } from './app.component';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { BrandPage} from  '../pages/brand/brand';
import { HomePage } from "../pages/home/home";
import { MerchantInfoPage } from "../pages/merchant-info/merchant-info";
import { MerchantMenuPage } from "../pages/merchant-menu/merchant-menu";
import { RewardPage } from  '../pages/reward/reward';
import { StampPage } from  '../pages/collect-stamp/stamp';
import { PromoCodePage } from  '../pages/promocode-page/promocode';
import { LoginPage } from '../pages/login/login';
import { ProductListPage } from "../pages/product-list/product-list";
import { ProductListOptionPage } from "../pages/product-list-options/product-list-options";
import { ModalBasketPage} from  '../pages/modal-basket-page/modal-basket-page';
import { StripePage} from  '../pages/stripe-page/stripe';
import { MyBeliPage} from  '../pages/my-beli/my-beli';
import { EditProfilePage } from "../pages/edit-profile/edit-profile";
import { ContactusPage } from "../pages/contactus/contactus";
import { DefaultPage } from "../pages/default/default";
import { ForgotPassPage } from "../pages/forgotpass/forgotpass";
import { ChangePasswordPage } from "../pages/change-password/change-password";
import { ReceiptsDetailsPage} from  '../pages/receipts-details/receipts-details';
import { FavouritesDetailsPage} from  '../pages/favourites-details/favourites-details';
import { LoyaltyPage} from  '../pages/loyalty/loyalty';
import { LoyaltyRewardPage} from  '../pages/loyalty-reward/reward';
import { ModalRedeemPage } from  '../pages/modal-redeem/redeem';
import { ModalRedeemInStore } from  '../pages/modal-redeem-in-store/store';
import { ModalThankYouPage } from  '../pages/modal-thank-you/thank-you';
import { ModalRedeemNow } from  '../pages/modal-redeem-now/redeem-now';
import { MerchantPage } from '../pages/merchant/merchant';
import { FavouritesPage } from '../pages/favourites/favourites';
import { ReceiptsPage } from '../pages/receipts/receipts';
import { MerchantDetailsPage } from '../pages/merchant-details/merchant-details';

import { FormatTimePipe } from  "../pages/pipe/count_down.pipe";
import { DateTimePipe } from "../pages/pipe/dateTime.pipe";
import { Ng2ImgFallbackModule } from 'ng2-img-fallback';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { IBeacon } from '@ionic-native/ibeacon';
import { Diagnostic } from '@ionic-native/diagnostic';
import { OpenNativeSettings } from '@ionic-native/open-native-settings';
import { NgxStripeModule,StripeService } from 'ngx-stripe';
import { Keyboard } from '@ionic-native/keyboard';
import { ImgCacheModule,ImgCacheService } from 'ng-imgcache';
import { MultiPickerModule } from 'ion-multi-picker';


@NgModule({
  declarations: [
    MyApp,
    BrandPage,
    HomePage,
    MerchantDetailsPage,
    MerchantInfoPage,
    MerchantMenuPage,
    ProductListPage,
    ProductListOptionPage,
    ModalBasketPage,
    ModalRedeemPage,
    StripePage,
    MyBeliPage,
    EditProfilePage,
    ContactusPage,
    DefaultPage,
    ForgotPassPage,
    ChangePasswordPage,
    DateTimePipe,
    FormatTimePipe,
    ReceiptsDetailsPage,
    FavouritesDetailsPage,
    RewardPage,
    LoyaltyPage,
    LoyaltyRewardPage,
    ModalThankYouPage,
    StampPage,
    ModalRedeemInStore,
    ModalRedeemNow,
    PromoCodePage,
    MerchantPage,
    ReceiptsPage,
    FavouritesPage,
    LoginPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpModule,
    Ng2ImgFallbackModule,
    SuperTabsModule.forRoot(),
    NgxStripeModule.forRoot('pk_test_sGBcuXcioZKGtPWmUNM8Lj2I'),
        //Test pk_test_sGBcuXcioZKGtPWmUNM8Lj2I  // live pk_live_bvH543BMaAuYLq6cAOkXhJyc
    ImgCacheModule,
    MultiPickerModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
  BrandPage,
  HomePage,
  MerchantDetailsPage,
  MerchantInfoPage,
  MerchantMenuPage,
  ProductListPage,
  ProductListOptionPage,
  ModalBasketPage,
  ModalRedeemPage,
  StripePage,
  MyBeliPage,
  EditProfilePage,
  ContactusPage,
  DefaultPage,
  ForgotPassPage,
  ChangePasswordPage,
  ReceiptsDetailsPage,
  FavouritesDetailsPage,
  RewardPage,
  LoyaltyPage,
  LoyaltyRewardPage,
  ModalThankYouPage,
  StampPage,
  ModalRedeemInStore,
  ModalRedeemNow,
  PromoCodePage,
  MerchantPage,
  ReceiptsPage,
  FavouritesPage,
  LoginPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Geolocation,
    Network,
    ConstantsProvider,
    ApiServicesProvider,
    GlobalVarService,
    GoogleMapsProvider,
    LocationAccuracy,
    InAppBrowser,
    IBeacon,
    Diagnostic,
    OpenNativeSettings,StripeService,Keyboard,ImgCacheService,ConnectivityProvider
  ]
})
export class AppModule {}
//,{pageTransition: 'md-transition'}
