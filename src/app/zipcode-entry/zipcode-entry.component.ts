import { AfterViewInit, Component, TemplateRef, ViewChild } from '@angular/core';
import { LocationService } from "../location.service";
import { WeatherService } from '../weather.service';
import { SharedService } from '../shared.service';
import { first } from 'rxjs/operators';
import { ZipCodeEntryService } from '../zipcode-entry.service';
import { ButtonState } from '../button/button.component';

@Component({
  selector: 'app-zipcode-entry',
  templateUrl: './zipcode-entry.component.html',
  styleUrls: ['./zipcode-entry.component.css']
})
export class ZipcodeEntryComponent implements AfterViewInit {
  @ViewChild('addlocation', { read: TemplateRef }) add!: TemplateRef<any>;
  @ViewChild('working', { read: TemplateRef }) working!: TemplateRef<any>;
  @ViewChild('done', { read: TemplateRef }) done!: TemplateRef<any>;
  
  country = '';
  buttonsTemplate = new Map<ButtonState, TemplateRef<any>>();

  constructor(private locationService : LocationService,
              private weatherService: WeatherService,
              private readonly shared: SharedService,
              readonly zipCodeEntryService: ZipCodeEntryService) { }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.buttonsTemplate.set(ButtonState.Default, this.add);
      this.buttonsTemplate.set(ButtonState.Working, this.working);
      this.buttonsTemplate.set(ButtonState.Done, this.done);
    });
  }

  addLocation(zip: string, countryName: string) {
    const zipCountry = { zip, countryName }
    this.weatherService.addCurrentConditions(zipCountry);
    this.shared.saveZipCode$.pipe(first()).subscribe({
      next: (zipCode: string) => {
        if(zipCode) {
          this.locationService.addLocation(zipCountry);
        }
      }
    })
  }

  setCountry(countryCode: string): void {
    this.country = countryCode;
  }
}
