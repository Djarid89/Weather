import { Component } from '@angular/core';
import { LocationService } from './location.service';
import { WeatherService } from './weather.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

    constructor(readonly weatherService: WeatherService, private readonly locationService: LocationService) {
      const storedZipCountries = this.locationService.getStoredLocations();
      for(const zipCountry of storedZipCountries) {
        this.weatherService.addCurrentConditions(zipCountry);
      }
    }
}
