import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-streamlit-iframe',
  standalone: true,
  imports: [],
  templateUrl: './streamlit-iframe.component.html',
  styleUrl: './streamlit-iframe.component.css'
})
export class StreamlitIframeComponent {

  streamlitUrl: SafeResourceUrl;
  iframeUrl = environment.streamlitUrl;

  constructor(private sanitizer: DomSanitizer) {
    this.streamlitUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.iframeUrl);
  }

}
