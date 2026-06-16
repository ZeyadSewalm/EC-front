import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { ForgetPassowrdService } from 'src/app/shared/services/forget-passowrd.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { PasswordModule } from 'primeng/password';

@Component({
  selector: 'app-newpassword',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    PasswordModule,
  ],
  templateUrl: './newpassword.component.html',
  styleUrls: ['./newpassword.component.scss'],
})
export class NewpasswordComponent implements OnInit {
  otp: string = '';
  uidb64: string = '';

  constructor(
    private route: ActivatedRoute,
    private _FormBuilder: FormBuilder,
    private _ForgetPassowrdService: ForgetPassowrdService,
    private _Router: Router,
    private _ToastrService: ToastrService,
    private translate: TranslateService
  ) {}
  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.otp = params['otp'];
      this.uidb64 = params['uidb64'];
    });
  }

  newPassword: FormGroup = this._FormBuilder.group({
    password: [
      '',
      [Validators.required, Validators.pattern(/^[a-z0-9]{6,20}$/)],
    ],
    password2: [
      '',
      [
        RxwebValidators.required(),
        RxwebValidators.compare({ fieldName: 'password' }),
      ],
    ],
  });

  passwordReset(): void {
    if (this.newPassword.valid) {
      const formatDate = new FormData();
      formatDate.append('otp', this.otp);
      formatDate.append('uidb64', this.uidb64);
      Object.keys(this.newPassword.value).forEach((key) => {
        formatDate.append(key, this.newPassword.get(key)?.value);
      });
      this._ForgetPassowrdService.createPassword(formatDate).subscribe({
        next: (res) => {
          console.log(res);
          this._ToastrService.success(res.message);
          this._Router.navigate(['./login']);
        },
        error: (err) => {
          console.log(err);
        },
      });
    } else {
      this.newPassword.markAllAsTouched();
    }
  }
  isArabic(): boolean {
    return this.translate.currentLang === 'ar';
  }
}
