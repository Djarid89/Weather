import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  startAddLocation$ = new Subject<void>();
  saveZipCode$ = new Subject<string>();
}
