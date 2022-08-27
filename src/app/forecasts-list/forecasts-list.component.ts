import { Component, OnDestroy } from '@angular/core';
import {WeatherService} from '../weather.service';
import {ActivatedRoute} from '@angular/router';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { ZipCountry } from '../location.service';

@Component({
  selector: 'app-forecasts-list',
  templateUrl: './forecasts-list.component.html',
  styleUrls: ['./forecasts-list.component.css']
})
export class ForecastsListComponent implements OnDestroy {
  zipCountry!: ZipCountry;
  forecast: any;
  private interval: any;
  isLoaded = true;

  constructor(readonly weatherService: WeatherService, route : ActivatedRoute) {
    route.params.subscribe({
      next: params => {
        this.zipCountry = { zip: params['zip'], countryName: params['countryName'] };
        this.updateList();
        setInterval(() => this.updateList(), 30000);
      }
    });
  }

  private updateList(): void {
    this.isLoaded = false;
    this.weatherService.getForecast(this.zipCountry).subscribe({
      next: data => this.forecast = data,
      error: () => Swal.fire({ position: 'center', icon: 'error', title: `Error occour updating forecast`, timer: 2000 }),
      complete: () => this.isLoaded = true
    });
  }

  ngOnDestroy(): void {
    clearInterval(this.interval);
  }
}
