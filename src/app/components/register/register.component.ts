import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {
  RxReactiveFormsModule,
  RxwebValidators,
} from '@rxweb/reactive-form-validators';
import { AuthService } from 'src/app/shared/services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { PasswordModule } from 'primeng/password';
import { CommonService } from 'src/app/shared/services/common.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RxReactiveFormsModule,
    InputGroupModule,
    InputGroupAddonModule,
    TranslateModule,
    PasswordModule,
    RouterLink,
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  constructor(
    private _Router: Router,
    private _FormBuilder: FormBuilder,
    private _AuthService: AuthService,
    private _ToastrService: ToastrService,
    public translate: TranslateService,
    private _CommonService: CommonService
  ) {}

  isloading: boolean = false;
  currentLang: string = '';
  registerForm: FormGroup = this._FormBuilder.group({
    full_name: [
      '',
      [Validators.required, Validators.minLength(3), Validators.maxLength(20)],
    ],
    email: ['', [Validators.required, Validators.email]],

    phone: [
      '',
      [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)],
    ],

    password: [
      '',
      [Validators.required, Validators.pattern(/^[A-Za-z0-9]{6,20}$/)],
    ],
    password2: [
      '',
      [
        RxwebValidators.required(),
        RxwebValidators.compare({ fieldName: 'password' }),
      ],
    ],
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
  }

  handleForm(): void {
    if (this.registerForm.valid) {
      this.isloading = true;
      const formData = new FormData();
      Object.keys(this.registerForm.value).forEach((key) => {
        formData.append(key, this.registerForm.get(key)?.value);
      });
      this._AuthService.register(formData, this.currentLang).subscribe({
        next: (response) => {
          this.isloading = false;
          if (response.status == 'success') {
            this._ToastrService.success(response.message);
            this._Router.navigate(['/login']);
          } else {
            this._ToastrService.warning(response.message);
          }
        },
        error: (err: HttpErrorResponse) => {
          console.log(err);
          this.isloading = false;
        },
      });
    } else {
      this.registerForm.markAllAsTouched();
    }
  }

  isArabic(): boolean {
    return this.translate.currentLang === 'ar';
  }
}
