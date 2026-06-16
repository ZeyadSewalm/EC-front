import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsService } from 'src/app/shared/services/products.service';
import { Category } from 'src/app/shared/interfaces/products';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonService } from 'src/app/shared/services/common.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule,RouterLink,TranslateModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  constructor(
    private _ProductsService: ProductsService,
    private _CommonService: CommonService,
    private translate:TranslateService
  ) {}
  category: Category[] = [];
  currentLang: string = '';
  loading:boolean=true
  ngOnInit(): void {
    this._CommonService.currentLang.subscribe({
      next: (res) => {
        console.log(res);
        this.currentLang = res;
        this.getAllCategory();
      },
      error: (err: HttpErrorResponse) => {
        console.log(err);
      },
    });
  }
  getAllCategory(): void {
    this.loading=true
    this._ProductsService.getAllCategory(this.currentLang).subscribe({
      next: (res) => {
        this.category = res;
        this.loading=false
      },
      error: (err: HttpErrorResponse) => {
        console.log(err);
      },
    });
  }
  isArabic(): boolean {
    return this.translate.currentLang === 'ar';
  }
}
