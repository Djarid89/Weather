import { Component } from '@angular/core';
import { LocationService } from "../location.service";
import { WeatherService } from '../weather.service';
import { SharedService } from '../shared.service';
import { first } from 'rxjs/operators';
import { ButtonColor } from '../button/button.component';
import { BehaviorSubject } from 'rxjs';
import { ZipCodeEntryService } from '../zipcode-entry.service';
import Swal from 'sweetalert2';

enum ButtonState {
  Default = 0,
  Working,
  Done
}

@Component({
  selector: 'app-zipcode-entry',
  templateUrl: './zipcode-entry.component.html',
  styleUrls: ['./zipcode-entry.component.css']
})
export class ZipcodeEntryComponent {
  buttonState$ = new BehaviorSubject<ButtonState>(ButtonState.Default);
  ButtonState = ButtonState;
  country = '';

  constructor(private locationService : LocationService,
              private weatherService: WeatherService,
              private readonly shared: SharedService,
              readonly zipCodeEntryService: ZipCodeEntryService) { }

  addLocation(zip: string, countryName: string) {
    const zipCountry = { zip, countryName }
    if(!zipCountry.zip) {
      Swal.fire({ position: 'center', icon: 'error', title: `Zip code missing`, timer: 2000 });
      return;
    }

    if(!zipCountry.countryName) {
      Swal.fire({ position: 'center', icon: 'error', title: `Country name code missing`, timer: 2000 });
      return;
    }

    if(this.weatherService.isConditionAlreadyPresent(zipCountry)) {
      Swal.fire({ position: 'center', icon: 'error', title: `Zip code ${zipCountry.zip} already present`, timer: 2000 });
      return;
    }

    this.buttonState$.next(ButtonState.Working);
    this.weatherService.addCurrentConditions(zipCountry);
    this.shared.saveZipCode$.pipe(first()).subscribe({
      next: (zipCode: string) => {
        if(zipCode) {
          this.locationService.addLocation(zipCountry);
        }
        this.buttonState$.next(ButtonState.Done);
        setTimeout(() => this.buttonState$.next(ButtonState.Default), 500);
      }
    })
  }

  getColor(): ButtonColor {
    if(this.buttonState$.getValue() === ButtonState.Working) {
      return ButtonColor.Working;
    } else if(this.buttonState$.getValue() === ButtonState.Done) {
      return ButtonColor.Done;
    } else {
      return ButtonColor.Default;
    }
  }

  setCountry(countryCode: string): void {
    this.country = countryCode;
  }

}
