import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Modals } from 'src/app/modals';
import { AuthService } from '../service/auth.service';
import { SignupRequestPaylaod } from './signup-request.payload';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;
  signupRequestPayload: SignupRequestPaylaod;

  constructor(
    private authService: AuthService,
    private router: Router,
    private modals: Modals
  ) {
    this.signupForm = new FormGroup({
      username: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, this.checkPassword.bind(this)]),
    });
    this.signupRequestPayload = {
      username: '',
      email: '',
      password: '',
    };
  }

  ngOnInit(): void {}

  signup() {
    if (this.signupForm.valid) {
      this.signupRequestPayload.email = this.signupForm.get('email')!.value;
      this.signupRequestPayload.username = this.signupForm.get('username')!.value;
      this.signupRequestPayload.password = this.signupForm.get('password')!.value;
      this.authService.signup(this.signupRequestPayload).subscribe({
        next: () =>
          this.router.navigate(['/login'], {
            queryParams: { registered: 'true' },
          }),
        error: (error) => this.modals.errorNotification(error.error),
      });
    }
  }

  checkPassword(control: FormControl) {
    const password = control.value;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*]/.test(password);

    const valid = password.length >= 8 && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
    return valid ? null : { invalidPassword: true };
  }
}