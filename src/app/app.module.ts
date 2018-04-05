import { BrowserModule } from '@angular/platform-browser';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { HomeModule } from './home/home.module';
import { ToastyModule } from 'ng2-toasty';
import { NgxLocalStorageModule } from 'ngx-localstorage';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';

import {firebaseConfig} from "../environments/firebase.config";
import { environment } from "../environments/environment";

import {AngularFireModule} from "angularfire2";
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { AngularFireAuthModule } from 'angularfire2/auth';

import { AuthServiceFirebase } from './shared/security/auth.service';
import { AuthGuard } from './shared/security/auth.guard';
import { HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from './shared/security/auth.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

// social login
import { SocialLoginModule, AuthServiceConfig } from "angularx-social-login";
import { GoogleLoginProvider} from "angularx-social-login";


import {
  FooterComponent,
  HeaderComponent,
  BookServiceService,
  FileuploadService,
  BookfirebaseService,
  SharedModule
} from './shared';

import {
  BookModule
} from './book';

import {
  SecurityModule
} from './security';

const rootRouting: ModuleWithProviders = RouterModule.forRoot([]);

let config = new AuthServiceConfig([
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider(environment.google_plus_oauth_client_key)
  }
]);

export function provideConfig() {
  return config;
}

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    HomeModule,
    rootRouting,
    SharedModule,
    BookModule,
    SecurityModule,
    ToastyModule,
    NgxLocalStorageModule.forRoot(),
    Ng4LoadingSpinnerModule.forRoot(),
    SocialLoginModule
  ],
  providers: [
              { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
              BookServiceService,
              FileuploadService, 
              BookfirebaseService, 
              AuthServiceFirebase, 
              AuthGuard,
              {
                provide: AuthServiceConfig,
                useFactory: provideConfig
              }
            ],          
  bootstrap: [AppComponent]
})
export class AppModule { }
