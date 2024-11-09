import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  username: FormControl = new FormControl('');
  password: FormControl = new FormControl('');

  constructor(
    private auth: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    if (this.auth.isAuthenticated()) this.router.navigate(['dashboard']);
  }

  login() {
    const credentials = {
      username: this.username.value,
      password: this.password.value
    }

    this.auth.login(credentials).subscribe((response: any) => {
      if (response.status === 'ok') {
        this.router.navigate(['/dashboard']);
      } else {
        this.username.reset();
        this.password.reset();
      }

    })
  }


}
