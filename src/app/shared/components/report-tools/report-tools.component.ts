import { Component, OnInit } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';
import { map } from 'rxjs';
import { Tools } from 'src/app/models/tools.models';
import { FirebaseService } from 'src/app/services/firebase.service';
import { PdfService } from 'src/app/services/pdf.service';

@Component({
  selector: 'app-report-tools',
  templateUrl: './report-tools.component.html',
  styleUrls: ['./report-tools.component.scss'],
})
export class ReportToolsComponent  implements OnInit {

  loading: boolean = false;
  tools: Tools[] = [];

  constructor(
    private LoadingController: LoadingController,
    private FirebaseService: FirebaseService,
    private PdfService: PdfService,
    private ToastController: ToastController
  ) { }

  ngOnInit() {
    this.getTool();
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
    this.PdfService.downloadPDF('content', `Herramientas_${formattedDate}`)
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

  getTool() {
    const path = 'herramientas/';
    this.FirebaseService.getCollectionTools(path)
      .snapshotChanges()
      .pipe(
        map(changes => changes.map(c => ({
          id: c.payload.doc.id,
          ...c.payload.doc.data()
        })))
      )
      .subscribe({
        next: (resp: any) => {
          this.tools = resp;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error al cargar las herramientas:', err);
          this.loading = false;
        }
      });
  }
}
