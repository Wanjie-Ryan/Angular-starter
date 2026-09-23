import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Api } from '../../services/api';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
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
  private router = inject(Router);
  private api = inject(Api);
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

    this.isSubmitting.set(true);
    const { username, password } = this.loginForm.value;

    // the reason why we don't use try catch is cause of the subscribe, it doesn't block and wait, it returns values immediately
    this.api
      .login(username!, password!)
      .pipe(finalize(() => this.isSubmitting.set(false)))
      .subscribe({
        next: (res) => {
          console.log('logging the response', res);
          localStorage.setItem('token', res.accessToken);
          this.toastr.success(`welcome back, ${res.firstName}`);
          this.router.navigate(['/dashboard']);
        },
        error: () => {
          this.toastr.error('Invalid username or password', 'Login Failed');
        },
      });
  }
}

// if i were to go further and catch explicit errors
// import { HttpErrorResponse } from '@angular/common/http';

// // ...
// error: (err: HttpErrorResponse) => {
//   switch (err.status) {
//     case 401:
//       this.toastr.error('Invalid username or password', 'Login Failed');
//       break;
//     case 409:
//       this.toastr.error('Account conflict, contact support', 'Conflict');
//       break;
//     case 429:
//       this.toastr.error('Too many attempts, try again later', 'Rate Limited');
//       break;
//     default:
//       this.toastr.error(err.error?.message ?? 'Something went wrong', 'Error');
//   }
// }
