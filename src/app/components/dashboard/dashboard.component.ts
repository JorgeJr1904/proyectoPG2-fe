import { Component } from '@angular/core';
import { StreamlitIframeComponent } from '../streamlit-iframe/streamlit-iframe.component';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ApiService } from '../../services/api.service';
import { CsvFilesDto } from '../../models/CsvFilesDto';
import { ToastrService } from 'ngx-toastr';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SharedModule } from '../../shared/shared.module';
import { NgxFileDropEntry } from 'ngx-file-drop';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [StreamlitIframeComponent, MatTableModule, MatIconModule, MatTooltipModule, SharedModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  public files: NgxFileDropEntry[] = [];
  displayedColumns: string[] = ['position', 'fileName', 'creationDate', "download", "view"];
  dataSource: MatTableDataSource<CsvFilesDto> = new MatTableDataSource<CsvFilesDto>();
  isLoading: boolean = false;
  fileLoaded: boolean = false;

  constructor(
    private api: ApiService,
    private toast: ToastrService
  ) { }


  ngOnInit() {
    this.getCsvUploadHistory();
  }


  getCsvUploadHistory() {
    this.api.get("file/").subscribe({
      next: (response: CsvFilesDto[]) => {
        if (!response || response.length < 1) {
          this.toast.info("No hay archivos subidos");
        } else {
          this.dataSource = new MatTableDataSource(response);
        }
      }, error: err => {
        this.toast.error("Ocurrió un error al obtener los archivos subidos");
        console.error(err);
      }
    });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString(); // Esto formatea la fecha a la zona horaria local
  }



  downloadFile(row: CsvFilesDto) {
    this.api.get(`file/${row.id}`).subscribe({
      next: (response) => {
        if (response) {
          this.base64ToFile(response.file, row.filename);
        } else this.toast.error("Ocurrió un error al descargar el archivo");
      }, error: err => {
        this.toast.error("Ocurrió un error al descargar el archivo");
        console.error(err);
      }
    });
  }

  getNewData(row: CsvFilesDto) {
    this.api.get(`streamlit/view-file/${row.id}`).subscribe({
      next: (response) => {
        if (response) {
          this.toast.success("Archivo cargado correctamente");
          this.fileLoaded = true;
          this.reloadGraphics();
        } else this.toast.error("Ocurrió un error al querer visualizar el archivo");
      }, error: err => {
        this.toast.error("Ocurrió un error al al querer visualizar el archivo");
        console.error(err);
      }
    });
  }

  uploadFile(fileName: string, base64: string) {
    this.api.post("file/", { filename: fileName, file_base64: base64 }).subscribe({
      next: (response) => {
        if (response) {
          this.toast.success("Archivo subido correctamente");
          this.getCsvUploadHistory();
        }
      },
      error: err => { }
    });
  }



  //UTILS -------------------------------------------------------------------

  base64ToFile(base64: string, fileName: string) {
    // Decodificar la cadena base64
    const byteString = atob(base64);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    // Crear un archivo Blob de tipo CSV
    const blob = new Blob([ab], { type: 'text/csv' });

    // Crear y configurar el enlace de descarga
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  reloadGraphics() {
    this.isLoading = true;
    setInterval(() => {
      this.isLoading = false;
    }, 100);
  }

  dropped(event: NgxFileDropEntry[]) {
    this.files = event;
    for (const droppedFile of event) {

      // Is it a file?
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          const reader = new FileReader();
          reader.onload = (e: any) => {
            const base64 = e.target.result.split("base64,")[1];
            this.uploadFile(file.name, base64);
          };
          reader.readAsDataURL(file);
        });
      }
    }
  }

  public fileOver(event: any) {
    console.log(event);
  }

  public fileLeave(event: any) {
    console.log(event);
  }


}
