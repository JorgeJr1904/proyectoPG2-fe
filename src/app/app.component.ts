import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './principal-components/navbar/navbar.component';
import { AuthService } from './services/auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  providers: [HttpClient],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'proyecto-graduacion-fe';

  isAuth = false;

  constructor(
    private auth: AuthService,
  ) { }

  get checkAuth() {
    return this.auth.isAuthenticated();
  }
}
