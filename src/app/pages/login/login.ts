import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
@Component({
  // custom tagname for this component, like registering <Login/> in Vue, so if i wanted to import it elsewhere it'd be <app-login></app-login>
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private fb = inject(FormBuilder);
  private toastr = inject(ToastrService);
  // signal false is Vue's ref false
  protected isSubmitting = signal(false);
  //if you want an attribute to be accessed both here and in the template, use protected or public keywords

  loginForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  protected errorFor(controlName: string): string | null {
    const control = this.loginForm.get(controlName);

    if (!control || !control.touched || control.valid) return null;

    if (control.errors?.['required']) return 'This field is required';
    return 'Invalid value';
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.toastr.error('Please fill in All required fields', 'Validation Error');

      return;
    }
    console.log('Wire to ApiService', this.loginForm.value);
  }
}
