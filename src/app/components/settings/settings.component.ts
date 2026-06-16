import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CustomerDashboardService } from 'src/app/shared/services/customer-dashboard.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { AccountComponent } from '../account/account.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule , ReactiveFormsModule , TranslateModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit{
  constructor(private _FormBuilder:FormBuilder , private translate:TranslateService , private _CustomerDashboardService:CustomerDashboardService , private _AuthService:AuthService , private _AccountComponent:AccountComponent){}

  imageForm: any;
  imageUrl: any ;

  onFileChange(e:any){
    console.log(e.target.files[0]);
    this.imageUrl = e.target.files[0];
  }
  

  userId:number = 0
  userImage:string = ''
  disableInputs:boolean = true

  userProfileForm:FormGroup|any = this._FormBuilder.group({
    image:[''],
    full_name: [''],
    email: [''],
    phone: [''],
    Address: [''],
    City: [''],
    State: [''],
    Country: [''],
  })
  getUserProfile(){
    this._CustomerDashboardService.getUserProfile(this.userId).subscribe({
      next:(res)=>{
        console.log('proData',res);
        this.userProfileForm.get('full_name')?.setValue(res.full_name)
        this.userProfileForm.get('email')?.setValue(res.user.email)
        this.userProfileForm.get('phone')?.setValue(res.user.phone)
        this.userProfileForm.get('Address')?.setValue(res.address)
        this.userProfileForm.get('City')?.setValue(res.city)
        this.userProfileForm.get('State')?.setValue(res.state)
        this.userProfileForm.get('Country')?.setValue(res.country)
        for (const key in this.userProfileForm.value) {          
         if (this.userProfileForm.get(key).value == 'null') {
            this.userProfileForm.get(key)?.setValue(' ')
          }
        }
      },
      error:(err)=>{
        console.log(err);
        
      }
    })
  }
  updateUserProfile(){    
    const itemData:FormGroup = this._FormBuilder.group({
      full_name:this.userProfileForm.get('full_name')?.value,
      email:this.userProfileForm.get('email')?.value,
      mobile:this.userProfileForm.get('phone')?.value,
      address:this.userProfileForm.get('Address')?.value,
      country:this.userProfileForm.get('Country')?.value,
      state:this.userProfileForm.get('State')?.value,
      city:this.userProfileForm.get('City')?.value,
    })

    const formData = new FormData();
      Object.keys(itemData.value).forEach((key) => {
        formData.append(key,itemData.get(key)?.value);
        if (this.imageUrl !== null && this.imageUrl !== undefined) {
          formData.append('image',this.imageUrl,this.imageUrl.name);
        }
        
      });
    this._CustomerDashboardService.updateUserProfile(this.userId , formData).subscribe({
      next:(res)=>{
        console.log('upd',res);
        this.disableInputs = true
        this._AccountComponent.getUserImage()
        this.getUserProfile()
      },
      error:(err)=>{
        console.log(err);
        console.log(this.imageUrl);
        
      }
    })
  }
  ngOnInit(): void {
    this._AuthService.decodeToken()
    this.userId = this._AuthService.userInfo.user_id
    console.log(this.userId);

    this.getUserProfile()
  }
  enableInputs(){
    this.disableInputs = false
  }

  isArabic(): boolean {
    return this.translate.currentLang === 'ar';
  }

  

  
}
