import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserData } from 'src/app/shared/interfaces/user-data';
import { AdminDashboardService } from 'src/app/shared/services/admin-dashboard.service';
import { jwtDecode } from 'jwt-decode';
import { HttpErrorResponse } from '@angular/common/http';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { MultiSelectModule } from 'primeng/multiselect';
import { FormsModule } from '@angular/forms';
import { TooltipModule } from 'primeng/tooltip';
import { RouterModule } from '@angular/router';
import { CommonService } from 'src/app/shared/services/common.service';
import { LoadingComponent } from 'src/app/components/loading/loading.component';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    TagModule,
    ButtonModule,
    MultiSelectModule,
    FormsModule,
    TooltipModule,
    RouterModule,
    TranslateModule,
    LoadingComponent
  ],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
})
export class OrdersComponent implements OnInit {
  userData: UserData = {} as UserData;
  products!: any[];
  first = 0;
  loading: boolean = true;
  filter: any;
  newArr: any;
  orderloading: boolean = true;
  currentLang: string = '';
  @ViewChild('dt2') dt2: any;
  constructor(
    private _AdminDashboardService: AdminDashboardService,
    private translate: TranslateService,
    private _CommonService: CommonService,
    private _AuthService:AuthService
  ) {}

  ngOnInit(): void {
    this.decodeToken();
    this._CommonService.vendorCurrentLang.subscribe({
      next: (res) => {
        this.currentLang = res;
        this.getDashboardProduct();
      },
      error: (err: HttpErrorResponse) => {
        console.log(err);
      },
    });
  }
  decodeToken() {
    this.userData=this._AuthService.userInfo;
  }

  getDashboardProduct(): void {
    this.orderloading = true;
    this._AdminDashboardService
      .getAllOrders(this.userData.vendor_id, this.currentLang)
      .subscribe({
        next: (res) => {
          this.products = res;
          this.loading = false;
          this.orderloading = false;
          this.products.forEach((product) => (product.date = new Date(<Date>product.date)));

        },
        error: (err: HttpErrorResponse) => {
          console.log(err);
        },
      });
  }

  getSeverity(status: string) {
    switch (status) {
      case 'paid':
        return 'success';
      case 'مدفوع':
        return 'success';
      case 'Pending':
        return 'warning';
      case 'قيد الانتظار':
        return 'warning';
      case 'unpublished':
        return 'danger';
    }
    return null;
  }

  exportCSV() {
    if (this.products && this.products.length > 0) {
      const headers = this.isArabic()
        ? [
            'كود المنتج',
            'صاحب الطلب',
            'السعر الكلى',
            'الحالة',
            'حالة الدفع',
            'التاريخ',
          ]
        : ['ID', 'Order Owner', 'Total Price', 'Status', 'Payment', 'Date'];
      const data = this.products.map((product) => [
        product.oid,
        product.full_name,
        product.total,
        product.order_status,
        product.payment_status,
        this.formatDate(product.date),
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
  formatDate(date: string): string {
    const formattedDate = new Date(date);
    return formattedDate.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  }
  exportPDF() {
    if (this.products && this.products.length > 0) {
      const headers = [
        'ID',
        'Order Owner',
        'Total Price',
        'Status',
        'Payment',
        'Date',
      ];
      const data = this.products.map((product) => [
        product.oid,
        product.full_name,
        product.total,
        product.order_status,
        product.payment_status,
        this.formatDate(product.date),
      ]);

      import('jspdf').then((jsPDF) => {
        import('jspdf-autotable').then((x) => {
          const doc = new jsPDF.default('p', 'px', 'a4');
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
            'كود المنتج',
            'صاحب الطلب',
            'السعر الكلى',
            'الحالة',
            'حالة الدفع',
            'التاريخ',
          ]
        : ['ID', 'Order Owner', 'Total Price', 'Status', 'Payment', 'Date'];
      const selectedColumns = this.products.map((product) => ({
        [headers[0]]: product.oid,
        [headers[1]]: product.full_name,
        [headers[2]]: product.total,
        [headers[3]]: product.order_status,
        [headers[4]]: product.payment_status,
        [headers[5]]: this.formatDate(product.date),
      }));

      import('xlsx').then((xlsx) => {
        const worksheet = xlsx.utils.json_to_sheet(selectedColumns);
        const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
        const excelBuffer: any = xlsx.write(workbook, {
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

  isArabic(): boolean {
    return this.translate.currentLang === 'ar';
  }

}
