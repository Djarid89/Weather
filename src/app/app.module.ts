import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { ZipcodeEntryComponent } from './zipcode-entry/zipcode-entry.component';
import {LocationService} from "./location.service";
import { ForecastsListComponent } from './forecasts-list/forecasts-list.component';
import { WeatherService } from "./weather.service";
import { CurrentConditionsComponent } from './current-conditions/current-conditions.component';
import { MainPageComponent } from './main-page/main-page.component';
import { RouterModule} from "@angular/router";
import { routing} from "./app.routing";
import { HttpClientModule} from "@angular/common/http";
import { ButtonComponent } from './button/button.component';
import { DropdownComponent } from './dropdown/dropdown.component';
import { ZipCodeEntryService } from './zipcode-entry.service';
import { BoldPipe } from './bold.pipe';

@NgModule({
  declarations: [
    AppComponent,
    ZipcodeEntryComponent,
    ForecastsListComponent,
    CurrentConditionsComponent,
    MainPageComponent,
    ButtonComponent,
    DropdownComponent,
    BoldPipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
    routing,
  ],
  providers: [LocationService, WeatherService, ZipCodeEntryService],
  bootstrap: [AppComponent]
})
export class AppModule { }
