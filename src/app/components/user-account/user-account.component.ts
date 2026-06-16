import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-user-account',
  standalone: true,
  imports: [CommonModule , RouterLink , TranslateModule],
  templateUrl: './user-account.component.html',
  styleUrls: ['./user-account.component.scss']
})
export class UserAccountComponent implements OnInit{
  constructor(private _AuthService:AuthService , private translate:TranslateService){}
  userName:string = ''
  ngOnInit(): void {
    this._AuthService.decodeToken()
    this.userName = this._AuthService.userInfo.full_name
  }
  isArabic(): boolean {
    return this.translate.currentLang === 'ar';
  }
}
