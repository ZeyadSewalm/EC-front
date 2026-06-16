import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  constructor() {}
  currentLang: BehaviorSubject<string> = new BehaviorSubject('en');
  vendorCurrentLang: BehaviorSubject<string> = new BehaviorSubject('en');
  currency: BehaviorSubject<any> = new BehaviorSubject({
    label: 'EGP',
    icon: 'fi-eg',
  });
}
