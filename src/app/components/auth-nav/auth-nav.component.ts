import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {
  TranslateLoader,
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import { CommonService } from 'src/app/shared/services/common.service';

@Component({
  selector: 'app-auth-nav',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, TranslateModule],
  templateUrl: './auth-nav.component.html',
  styleUrls: ['./auth-nav.component.scss'],
})
export class AuthNavComponent implements OnInit {
  currentLang: string = '';

  constructor(
    public translate: TranslateService,
    private _CommonService: CommonService
  ) {}
  changeCurrentLang(lang: string) {
    this.translate.use(lang);
    localStorage.setItem('currentLang', lang);
    this._CommonService.currentLang.next(lang);
  }
  selectedLanguage: string = '';

  ngOnInit() {
    this.currentLang = localStorage.getItem('currentLang') || 'en';
    this.translate.use(this.currentLang);
    this._CommonService.currentLang.next(this.currentLang);
    this.selectedLanguage =
      localStorage.getItem('selectedLanguage') || 'English';
  }

  selectLanguage(language: string) {
    this.selectedLanguage = language;
    localStorage.setItem('selectedLanguage', this.selectedLanguage);
  }

  getIconClass(language: string) {
    switch (language) {
      case 'English':
        return 'fi fi-gb-eng';
      case 'Arabic':
        return 'fi fi-eg';
      default:
        return '';
    }
  }
  isArabic(): boolean {
    return this.translate.currentLang === 'ar';
  }
}
