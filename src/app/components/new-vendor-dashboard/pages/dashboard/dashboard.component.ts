import { DashboardProduct } from './../../../../shared/interfaces/dashboard-product';
import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminDashboardService } from 'src/app/shared/services/admin-dashboard.service';
import { UserData } from 'src/app/shared/interfaces/user-data';
import { jwtDecode } from 'jwt-decode';
import { HttpErrorResponse } from '@angular/common/http';
import { DashboardHome } from 'src/app/shared/interfaces/dashboard-home';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { MultiSelectModule } from 'primeng/multiselect';
import { FormsModule } from '@angular/forms';
import { TooltipModule } from 'primeng/tooltip';
import { ToastrService } from 'ngx-toastr';
import { RouterLink } from '@angular/router';
import { ConverttonumberPipe } from 'src/app/shared/pipes/converttonumber.pipe';
import { ProductsService } from 'src/app/shared/services/products.service';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { CommonService } from 'src/app/shared/services/common.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LoadingComponent } from 'src/app/components/loading/loading.component';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    TagModule,
    ButtonModule,
    MultiSelectModule,
    FormsModule,
    TooltipModule,
    RouterLink,
    ConverttonumberPipe,
    LazyLoadImageModule,
    TranslateModule,
    LoadingComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  userData: UserData = {} as UserData;
  HomeData: DashboardHome[] = [];
  products!: DashboardProduct[];
  first = 0;
  category!: any[];
  loading: boolean = true;
  filter: any;
  homeloading: boolean = true;
  productCurrency: string = '';
  @ViewChild('dt2') dt2: any;
  constructor(
    private _AdminDashboardService: AdminDashboardService,
    private _ToastrService: ToastrService,
    private _CommonService: CommonService,
    private translate: TranslateService,
    private _AuthService:AuthService
  ) {}

  ngOnInit(): void {
    this.decodeToken();
    this.getHomeData();
    this._CommonService.vendorCurrentLang.subscribe({
      next: (res) => {
        console.log(res);
        this.getDashboardProduct(res);
      },
      error: (err: HttpErrorResponse) => {
        console.log(err);
      },
    });
    this.category = [
      { title: 'woman' },
      { title: 'children' },
      { title: 'man' },
    ];
    this._CommonService.currency.subscribe({
      next: (res) => {
        console.log(res);
        this.productCurrency = res.label;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  decodeToken() {
    this.userData=this._AuthService.userInfo;
  }

  getHomeData(): void {
    this.homeloading = true;
    this._AdminDashboardService.getHomeData(this.userData.vendor_id).subscribe({
      next: (res) => {
        this.HomeData = res;
        this.homeloading = false;
        console.log(this.HomeData);
      },
      error: (err: HttpErrorResponse) => {
        console.log(err);
      },
    });
  }

  getDashboardProduct(lang: string): void {
    this.homeloading = true;
    this._AdminDashboardService
      .getAdminProduct(this.userData.vendor_id, lang)
      .subscribe({
        next: (res) => {
          this.products = res;
          this.homeloading = false;
          console.log(this.products);
          this.loading = false;
        },
        error: (err: HttpErrorResponse) => {
          console.log(err);
        },
      });
  }

  getSeverity(status: string) {
    switch (status) {
      case 'published':
        return 'success';
      case 'unpublished':
        return 'warning';
      case 'unpublished':
        return 'danger';
    }
    return null;
  }

  filterProductsByCategory(categoryTitle: string): DashboardProduct[] {
    if (!categoryTitle) return this.products;
    return this.products.filter(
      (product) => product.category.title === categoryTitle
    );
  }

  exportCSV() {
    if (this.products && this.products.length > 0) {
      const headers = this.isArabic()
        ? [
            'اسم المنتج',
            'السعر بالجنيه',
            'السعر بالدرهم',
            'قسم',
            'الكيمة',
            'التقييم',
          ]
        : ['Name', 'Price EGP', 'Price AED', 'Category', 'Quantity', 'Rating'];
      const data = this.products.map((product) => [
        product.title,
        product.price_EGP,
        product.price_AED,
        product.category,
        product.stock_qty,
        product.rating,
      ]);
      this.exportTableToCSV(headers, data, 'products.csv');
    } else {
      console.error('No data available for CSV export.');
    }
  }

  exportTableToCSV(headers: string[], data: any[][], filename: string) {
    const csvContent =
      headers.join(',') + '\n' + data.map((row) => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);

    link.click();
    document.body.removeChild(link);
  }

  exportPDF() {
    if (this.products && this.products.length > 0) {
      const headersArabic = [
        'اسم المنتج',
        'السعر بالجنيه',
        'السعر بالدرهم',
        'القسم',
        'الكمية',
        'التقييم',
      ];
      const headersEnglish = [
        'Name',
        'Price EGP',
        'Price AED',
        'Category',
        'Quantity',
        'Rating',
      ];

      const headers = this.isArabic() ? headersArabic : headersEnglish;

      const data = this.products.map((product) => [
        product.title ? product.title : '',
        product.price_EGP ? product.price_EGP.toString() : '',
        product.price_AED ? product.price_AED.toString() : '',
        product.category ? product.category : '',
        product.stock_qty ? product.stock_qty.toString() : '',
        product.rating ? product.rating.toString() : '',
      ]);

      import('jspdf').then((jsPDF) => {
        import('jspdf-autotable').then((x) => {
          const doc = new jsPDF.default('p', 'px', 'a4');
          if (this.isArabic()) {
            doc.setFont('Arial');
            doc.setFontSize(12);
            // doc.textDirection('rtl');
          }
          (doc as any).autoTable({ head: [headers], body: data });
          doc.save('products.pdf');
        });
      });
    }
  }

  exportExcel() {
    if (this.products && this.products.length > 0) {
      const headers = this.isArabic()
        ? [
            'اسم المنتج',
            'السعر بالجنيه',
            'السعر بالدرهم',
            'قسم',
            'الكيمة',
            'التقييم',
          ]
        : ['Name', 'Price EGP', 'Price AED', 'Category', 'Quantity', 'Rating'];

      const selectedColumns = this.products.map((product) => ({
        [headers[0]]: product.title,
        [headers[1]]: product.price_EGP,
        [headers[2]]: product.price_AED,
        [headers[3]]: product.category,
        [headers[4]]: product.stock_qty,
        [headers[5]]: product.rating,
      }));

      import('xlsx').then((xlsx) => {
        const worksheet = xlsx.utils.json_to_sheet(selectedColumns);
        const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
        const excelBuffer = xlsx.write(workbook, {
          bookType: 'xlsx',
          type: 'array',
        });
        this.saveAsExcelFile(excelBuffer, 'products');
      });
    }
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName + '_export_' + new Date().getTime() + '.xlsx';
    link.click();
    window.URL.revokeObjectURL(url);
  }

  deleteProduct(id: any): void {
    this.homeloading = true;
    console.log('delete');
    this._AdminDashboardService
      .deleteProduct(this.userData.vendor_id, id)
      .subscribe({
        next: (res) => {
          console.log(res);
          this._ToastrService.success(res.message);
          this.products = res.products;
          this.homeloading = false;
          this.HomeData = [res.dashboard_stats];
        },
        error: (err: HttpErrorResponse) => {
          console.log(err);
        },
      });
  }

  isArabic(): boolean {
    return this.translate.currentLang === 'ar';
  }

  // Inside your component class
  isFirstPage(): boolean {
    return this.first === 0;
  }

  isLastPage(): boolean {
    return this.first >= this.dt2.totalRecords - this.dt2.rows;
  }

  get totalPages(): number {
    return Math.ceil(this.dt2.totalRecords / this.dt2.rows);
  }

  changePage(page: number) {
    this.first = page * this.dt2.rows;
  }

  prevPage() {
    this.first -= this.dt2.rows;
  }

  nextPage() {
    this.first += this.dt2.rows;
  }
}
