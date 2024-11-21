import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs';
import { Costs } from 'src/app/models/costs.models';
import { Employees } from 'src/app/models/employees.model';
import { Inventory } from 'src/app/models/inventory.model';
import { Providers } from 'src/app/models/providers.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { PdfService } from 'src/app/services/pdf.service';
import { UtilsService } from 'src/app/services/utils.service';

import { LoadingController } from '@ionic/angular';
import { Registers } from 'src/app/models/registers.model';
import { Tools } from 'src/app/models/tools.models';

@Component({
  selector: 'app-finance',
  templateUrl: './finance.page.html',
  styleUrls: ['./finance.page.scss'],
})
export class FinancePage implements OnInit {

  loading: boolean = false;
  isPrinting: boolean = false;

  costs: Costs[] = [];
  employees: Employees[] = [];
  inventory: Inventory[] = [];
  providers: Providers[] = [];
  register: Registers[] = [];
  tools: Tools[] = [];

  constructor(
    private loadingCtrl: LoadingController,
    private utilsService: UtilsService,
    private firebaseService: FirebaseService,
    private pdfService: PdfService
  ) { }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading = true;
    this.getEmployee();
    this.getCosts();
    this.getInventory();
    this.getProvider();
    this.getRegister();
    this.getTools();
  }

  user(): User {
    return this.utilsService.getLocalStorage('user');
  }

  async generatePDF() {
    const loading = await this.loadingCtrl.create({
      spinner: 'crescent',
      message: 'Generando Reporte...',
      translucent: true
    });
    await loading.present(); // Muestra el spinner

    // Obtener la fecha actual en formato YYYY-MM-DD
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Meses son de 0 a 11
    const year = today.getFullYear();
    const formattedDate = `${day}-${month}-${year}`;

    // Generar el PDF con la fecha en el nombre del archivo
    this.pdfService.downloadPDF('content', `Reporte_Finanzas_${formattedDate}`).then(() => {
      loading.dismiss(); // Oculta el spinner después de generar el PDF
    }).catch(error => {
      console.error('Error generating PDF:', error);
      loading.dismiss(); // También ocultar el spinner en caso de error
    });
  }

  getCosts() {
    const path = 'costos/';
    this.firebaseService.getCollectionCosts(path)
      .snapshotChanges()
      .pipe(
        map(changes => changes.map(c => ({
          id: c.payload.doc.id,
          ...c.payload.doc.data()
        })))
      )
      .subscribe({
        next: (resp: any) => {
          this.costs = resp;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error loading costs:', err);
          this.loading = false;
        }
      });
  }

  getEmployee() {
    const path = 'empleados/';
    this.firebaseService.getCollectionData(path)
      .snapshotChanges()
      .pipe(
        map(changes => changes.map(c => ({
          id: c.payload.doc.id,
          ...c.payload.doc.data()
        })))
      )
      .subscribe({
        next: (resp: any) => {
          this.employees = resp;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error loading employees:', err);
          this.loading = false;
        }
      });
  }

  getInventory() {
    const path = 'inventario/';
    this.firebaseService.getCollectionInventory(path)
      .snapshotChanges()
      .pipe(
        map(changes => changes.map(c => ({
          id: c.payload.doc.id,
          ...c.payload.doc.data()
        })))
      )
      .subscribe({
        next: (resp: any) => {
          this.inventory = resp;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error loading inventory:', err);
          this.loading = false;
        }
      });
  }

  getProvider() {
    const path = 'proveedores/';
    this.firebaseService.getCollectionRegister(path)
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
  
  getRegister() {
    let path = `registros/`;
    /* let path = `users/${this.user().uid}/registros`; */

    this.loading = true;

    let sub = this.firebaseService.getCollectionRegister(path)
      .snapshotChanges().pipe(
        map(changes => changes.map(c => ({
          id: c.payload.doc.id,
          ...c.payload.doc.data()
        })))
      ).subscribe({
        next: (resp: any) => {
          this.register = resp

          this.loading = false;
          sub.unsubscribe();
        }
      })
  }

  getTools() {
    let path = `herramientas/`;
    /* let path = `users/${this.user().uid}/herramientas`; */

    this.loading = true;

    let sub = this.firebaseService.getCollectionTools(path)
      .snapshotChanges().pipe(
        map(changes => changes.map(c => ({
          id: c.payload.doc.id,
          ...c.payload.doc.data()
        })))
      ).subscribe({
        next: (resp: any) => {
          this.tools = resp

          this.loading = false;
          sub.unsubscribe();
        }
      })
  }

  doRefresh(event: any) {
    setTimeout(() => {
      this.loadData();
      event.target.complete();
    }, 1000);
  }
}