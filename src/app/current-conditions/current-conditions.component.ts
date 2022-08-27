import { Component, OnDestroy, OnInit } from '@angular/core';
import {WeatherCondition, WeatherService} from "../weather.service";
import {LocationService, ZipCountry} from "../location.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-current-conditions',
  templateUrl: './current-conditions.component.html',
  styleUrls: ['./current-conditions.component.css']
})
export class CurrentConditionsComponent implements OnInit, OnDestroy {

  private interval: any;

  constructor(readonly weatherService: WeatherService, private readonly router : Router, private readonly locationService: LocationService) { }

  ngOnInit(): void {
    this.interval = setInterval(() => this.weatherService.updateCurrentConditions(), 30000);
  }

  getCurrentConditions(): WeatherCondition[] {
    return this.weatherService.getCurrentConditions();
  }

  showForecast(zip: string, countryName: string): void {
    this.router.navigate(['/forecast', { zip, countryName }])
  }

  removeLocation(zip: string, countryName:string): void {
    const zipCountry: ZipCountry = { zip, countryName };
    this.locationService.removeLocation(zipCountry);
    this.weatherService.removeCurrentConditions(zipCountry);
  }

  ngOnDestroy(): void {
    clearInterval(this.interval);
  }
}
