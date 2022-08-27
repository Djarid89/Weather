import { Injectable } from '@angular/core';

export const LOCATIONS: string = "locations";

export interface ZipCountry {
  zip: string;
  countryName: string;
}

@Injectable()
export class LocationService {
  private locations: ZipCountry[] = [];

  getStoredLocations(): ZipCountry[] {
    let storedLocations = localStorage.getItem(LOCATIONS);
    this.locations = storedLocations ? JSON.parse(storedLocations) : [];
    return storedLocations ? this.locations : [];
  }

  addLocation(zipCountry: ZipCountry) {
    this.locations.push({ zip: zipCountry.zip, countryName: zipCountry.countryName});
    localStorage.setItem(LOCATIONS, JSON.stringify(this.locations));
  }

  removeLocation(zipCountry: ZipCountry){
    let index = this.locations.findIndex((location: ZipCountry) => {
      return location.zip.toLowerCase() === zipCountry.zip.toLowerCase() && location.countryName.toLowerCase() === zipCountry.countryName.toLowerCase();
    });
    if (index !== -1){
      this.locations.splice(index, 1);
      localStorage.setItem(LOCATIONS, JSON.stringify(this.locations));
    }
  }
}
