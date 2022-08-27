import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { WeatherData } from './models/Weather';
import { SharedService } from './shared.service';
import { ZipCountry } from './location.service';
import Swal from 'sweetalert2';

export interface WeatherCondition {
  zip: string,
  data: WeatherData
}

@Injectable()
export class WeatherService {

  static URL = 'https://api.openweathermap.org/data/2.5';
  static APPID = '5a4b2d457ecbef9eb2a71e480b947604';
  static ICON_URL = 'https://raw.githubusercontent.com/udacity/Sunshine-Version-2/sunshine_master/app/src/main/res/drawable-hdpi/';
  private currentConditions: WeatherCondition[] = [];
  private loadedCondition = new BehaviorSubject<number>(0);

  constructor(private readonly http: HttpClient, private readonly shared: SharedService) { }

  addCurrentConditions(zipCountry: ZipCountry): void {
    if(!zipCountry?.zip) {
      Swal.fire({ position: 'center', icon: 'error', title: `You must insert zip code`, timer: 2000 });
      return;
    }
    if(!zipCountry?.countryName) {
      Swal.fire({ position: 'center', icon: 'error', title: `You must insert country name`, timer: 2000 });
      return;
    }
    // Here we make a request to get the current conditions data from the API. Note the use of backticks and an expression to insert the zipcode
    const url = `${WeatherService.URL}/weather?zip=${zipCountry.zip},${zipCountry.countryName}&units=imperial&APPID=${WeatherService.APPID}`;
    this.http.get<WeatherData>(url).subscribe({
      next: (data: WeatherData) => {
        this.currentConditions.push({zip: zipCountry.zip, data: data});
        this.shared.saveZipCode$.next(zipCountry.zip);
      },
      error: () => {
        Swal.fire({ position: 'center', icon: 'error', title: `Error occour with zip code ${zipCountry.zip}`, timer: 2000 });
        this.shared.saveZipCode$.next('');
      },
      complete: () => this.loadedCondition.next(this.loadedCondition.getValue() + 1)
    });
  }

  updateCurrentConditions(): void {
    this.loadedCondition.next(0);
    for(const currentCondition of this.currentConditions) {
      const url = `${WeatherService.URL}/weather?zip=${currentCondition.zip},${currentCondition.data.sys.country}&units=imperial&APPID=${WeatherService.APPID}`;
      this.http.get<WeatherData>(url).subscribe({
        next: (data: WeatherData) => currentCondition.data = data,
        error: () => Swal.fire({ position: 'center', icon: 'error', title: `Error occour updating zip code ${currentCondition.zip}`, timer: 2000 }),
        complete: () => this.loadedCondition.next(this.loadedCondition.getValue() + 1)
      });
    }
  }

  isConditionAlreadyPresent(zipCountry: ZipCountry): boolean {
    return this.currentConditions.some((condition: WeatherCondition) => condition.zip.toLowerCase() === zipCountry.zip.toLowerCase() && condition.data.sys.country.toLowerCase() === zipCountry.countryName.toLowerCase());
  }

  isLoaded(): boolean {
    return this.loadedCondition.getValue() === this.currentConditions.length;
  }

  removeCurrentConditions(zipCountry: ZipCountry): void {
    for(let i in this.currentConditions) {
      if(this.currentConditions[i].zip.toLowerCase() == zipCountry.zip.toLowerCase() && this.currentConditions[i].data.sys.country.toLowerCase() == zipCountry.countryName.toLowerCase()) {
        this.currentConditions.splice(+i, 1);
        this.loadedCondition.next(this.loadedCondition.getValue() - 1);
      }
    }
  }

  getCurrentConditions(): WeatherCondition[] {
    return this.currentConditions;
  }

  getForecast(zipCountry: ZipCountry): Observable<any> {
    // Here we make a request to get the forecast data from the API. Note the use of backticks and an expression to insert the zipcode
    return this.http.get(`${WeatherService.URL}/forecast/daily?zip=${zipCountry.zip},${zipCountry.countryName}&units=imperial&cnt=5&APPID=${WeatherService.APPID}`);
  }

  getWeatherIcon(id: number): string {
    if (id >= 200 && id <= 232)
      return WeatherService.ICON_URL + "art_storm.png";
    else if (id >= 501 && id <= 511)
      return WeatherService.ICON_URL + "art_rain.png";
    else if (id === 500 || (id >= 520 && id <= 531))
      return WeatherService.ICON_URL + "art_light_rain.png";
    else if (id >= 600 && id <= 622)
      return WeatherService.ICON_URL + "art_snow.png";
    else if (id >= 801 && id <= 804)
      return WeatherService.ICON_URL + "art_clouds.png";
    else if (id === 741 || id === 761)
      return WeatherService.ICON_URL + "art_fog.png";
    else
      return WeatherService.ICON_URL + "art_clear.png";
  }
}
