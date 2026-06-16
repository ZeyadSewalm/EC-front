import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { ToastrService } from 'ngx-toastr';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { PasswordModule } from 'primeng/password';
import { CommonService } from 'src/app/shared/services/common.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputGroupModule,
    InputGroupAddonModule,
    RouterLink,
    TranslateModule,
    PasswordModule,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  constructor(
    private _FormBuilder: FormBuilder,
    private _AuthService: AuthService,
    private _Router: Router,
    private _ToastrService: ToastrService,
    public translate: TranslateService,
    private _CommonService: CommonService
  ) {}
  isloading: boolean = false;
  currentLang: string = '';
  loginForm: FormGroup = this._FormBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  ngOnInit(): void {
    this._CommonService.currentLang.subscribe({
      next: (res) => {
        console.log(res);
        this.currentLang = res;
      },
      error: (err: HttpErrorResponse) => {
        console.log(err);
      },
    });
    this.translate.use(this.currentLang);
  }

  isArabic(): boolean {
    return this.translate.currentLang === 'ar';
  }

  handleLogin() {
    if (this.loginForm.valid) {
      this.isloading = true;

      const formData = new FormData();
      Object.keys(this.loginForm.value).forEach((key) => {
        formData.append(key, this.loginForm.get(key)?.value);
      });

      this._AuthService.login(formData, this.currentLang).subscribe({
        next: (response) => {
          this.isloading = false;

          if (response.access) {
            this._ToastrService.success('Login successfully ✅');
            const redirect = this._AuthService.getRedirectUrl();
            if (redirect) {
              this._AuthService.clearRedirectUrl();
              this._Router.navigateByUrl(redirect);
            } else {
              this._Router.navigate(['/home']);
            }
          } else {
            this._ToastrService.warning('Invalid login response');
          }
        },
        error: (err: HttpErrorResponse) => {
          this.isloading = false;
          this._ToastrService.warning(err.error.detail || 'Login failed');
        },
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
