import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  api = environment.apiUrl;
  streamlit = environment.streamlitUrl;

  constructor(
    private http: HttpClient,
    private auth: AuthService
  ) { }

  //----------------------------Start Methods for backend of Python ------------------------------------------------

  get(url: string, options?: any): Observable<any> {
    if (!url.startsWith('/')) url = '/' + url;
    let newUrl = this.api + url;
    if (options) return this.http.get(newUrl, options);
    return this.http.get(newUrl);
  }

  post(url: string, body: any, options?: any): Observable<any> {
    if (!url.startsWith('/')) url = '/' + url;
    let newUrl = this.api + url;
    if (options) return this.http.post(newUrl, body, options);
    return this.http.post(newUrl, body);
  }

  put(url: string, body: any, options?: any): Observable<any> {
    if (!url.startsWith('/')) url = '/' + url;
    let newUrl = this.api + url;
    if (options) return this.http.put(newUrl, body, options);
    return this.http.put(newUrl, body);
  }

  delete(url: string, body: any): Observable<any> {
    if (!url.startsWith('/')) url = '/' + url;
    let newUrl = this.api + url;
    return this.http.delete(newUrl, body);
  }

  // --------------------Finish Method for python backend -----------------------
}
