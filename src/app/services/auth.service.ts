import { Inject, Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private tokenKey = 'auth_token';
  private authApi = environment.apiUrl + '/auth/'

  constructor(
    private api: HttpClient,
    private toast: ToastrService,
    private router: Router
  ) { }

  public login(credentials: UserLogin) {
    return this.api.post<any>(this.authApi, credentials).pipe(
      tap({
        next: (response) => {
          if (response.status === 'ok') {
            this.setToken(response.token); // Guarda el token en caso de éxito
          } else {
            this.toast.warning(response.message); // Muestra un mensaje de advertencia si el status no es 'ok'
          }
        },
        error: (err) => {
          console.error(err)
          this.toast.error(err.error.message); // Muestra un mensaje de error en caso de fallo
        }
      })
    );
  }

  logout(): void {
    this.clearToken();
    this.router.navigate(['/login']); // Redirige al usuario a la página de login
  }

  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  // Limpiar el token de localStorage
  private clearToken(): void {
    localStorage.removeItem(this.tokenKey);
  }

  // Obtener el token
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // Verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    return !!this.getToken(); // Retorna true si hay un token almacenado
  }

}


export class UserLogin {
  username: string = '';
  password: string = '';
}
