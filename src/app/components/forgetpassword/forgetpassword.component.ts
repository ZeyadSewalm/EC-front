import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ForgetPassowrdService } from 'src/app/shared/services/forget-passowrd.service';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-forgetpassword',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './forgetpassword.component.html',
  styleUrls: ['./forgetpassword.component.scss'],
})
export class ForgetpasswordComponent {
  constructor(
    private _ForgetPassowrdService: ForgetPassowrdService,
    private _FormBuilder: FormBuilder,
    private _ToastrService: ToastrService,
    private translate: TranslateService
  ) {}

  forgetpassword: FormGroup = this._FormBuilder.group({
    email: ['', [Validators.required, Validators.email]],
  });

  passwordReset(): void {
    const formatDate = new FormData();
    formatDate.append('email', this.forgetpassword.get('email')?.value);
    formatDate.append('link', 'http://localhost:4200');
    if (this.forgetpassword.valid) {
      this._ForgetPassowrdService.passwordreset(formatDate).subscribe({
        next: (res) => {
          console.log(res);

          if (res.status == 'success') {
            this._ToastrService.success(res.message);
            setTimeout(() => {
              window.open('https://mail.google.com/', '_self');
            }, 3000);
          } else {
            this._ToastrService.warning(res.message);
          }
        },
        error: (err) => {
          console.log(err);
        },
      });
    } else {
      this.forgetpassword.markAllAsTouched()
    }
  }
  isArabic(): boolean {
    return this.translate.currentLang === 'ar';
  }
}
