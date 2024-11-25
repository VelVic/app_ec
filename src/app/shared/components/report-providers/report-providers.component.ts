import { Component, OnInit } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';
import { map } from 'rxjs';
import { Providers } from 'src/app/models/providers.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { PdfService } from 'src/app/services/pdf.service';

@Component({
  selector: 'app-report-providers',
  templateUrl: './report-providers.component.html',
  styleUrls: ['./report-providers.component.scss'],
})
export class ReportProvidersComponent implements OnInit {

  loading: boolean = false;
  providers: Providers[] = [];

  constructor(
    private LoadingController: LoadingController,
    private FirebaseService: FirebaseService,
    private PdfService: PdfService,
    private ToastController: ToastController
  ) { }

  ngOnInit() {
    this.getProvider();
  }

  async generatePDF() {
    // Mostrar mensaje de "Generando Reporte..."
    const loading = await this.LoadingController.create({
      spinner: 'crescent',
      message: 'Generando Reporte...',
      translucent: true
    });
    await loading.present();
    // Obtener la fecha actual en formato DD-MM-YYYY
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Meses son de 0 a 11
    const year = today.getFullYear();
    const formattedDate = `${day}-${month}-${year}`;
    this.PdfService.downloadPDF('content', `Proveedores_${formattedDate}`)
      .then(async () => {
        await loading.dismiss();
        if (screen.width > 500) {
          const toast = await this.ToastController.create({
            message: 'Reporte generado con éxito',
            duration: 3000, // 3 segundos
            color: 'success',
            position: 'bottom',
            icon: 'checkmark-circle-outline',
          });
          await toast.present();
        } if (screen.width < 500) {
          const toast = await this.ToastController.create({
            message: 'Sugerencia: El reporte puede visualizarse con mayor claridad en una computadora o girando el celular.',
            duration: 3000, // 3 segundos
            color: 'warning',
            position: 'bottom',
            icon: 'warning-outline',
          });
          await toast.present();
        }
      })
      .catch(async (error) => {
        console.error('Error generando PDF:', error);
        await loading.dismiss(); // Ocultar el spinner en caso de error
      });
  }

  getProvider() {
    const path = 'proveedores/';
    this.FirebaseService.getCollectionRegister(path)
      .snapshotChanges()
      .pipe(
        map(changes => changes.map(c => ({
          id: c.payload.doc.id,
          ...c.payload.doc.data()
        })))
      )
      .subscribe({
        next: (resp: any) => {
          this.providers = resp;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error loading providers:', err);
          this.loading = false;
        }
      });
  }
}