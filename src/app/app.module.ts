import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxUiLoaderModule,NgxUiLoaderConfig,SPINNER,PB_DIRECTION,POSITION } from "ngx-ui-loader";
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { FullComponent } from './layouts/full/full.component';
import { SidebarComponent } from './layouts/full/sidebar/sidebar.component';
import { HeaderComponent } from './layouts/full/header/header.component';
import { SharedModule } from './shared/shared.module';
import { MaterialModule } from './shared/material-module';
import { DashboardModule } from './dashboard/dashboard.module';
import {FormsModule,ReactiveFormsModule} from '@angular/forms'
import { FlexLayoutModule } from '@angular/flex-layout';
import { TokenInterceptorService } from './services/interceptor/token-interceptor.service';


const ngxUiLoaderConfig: NgxUiLoaderConfig = {
  text:"Loading ...",
  textColor:"#FFFFFF",
  bgsColor: "#1ABC9C",
  fgsColor: "#1ABC9C",
  bgsPosition: POSITION.bottomCenter,
  bgsSize: 40,
  bgsType: SPINNER.rectangleBounce, // background spinner type
  fgsType: SPINNER.chasingDots, // foreground spinner type
  fgsSize:100,
  pbDirection: PB_DIRECTION.leftToRight, // progress bar direction
  pbThickness: 5, // progress bar thickness
};


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    FullComponent,
    SidebarComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    HttpClientModule,
    NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
     DashboardModule
  ],
  providers: [    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptorService, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
