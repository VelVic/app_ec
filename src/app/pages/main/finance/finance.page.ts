import { Component, inject, OnInit } from '@angular/core';
import { map } from 'rxjs';
import { Costs } from 'src/app/models/costs.models';
import { Employees } from 'src/app/models/employees.model';
import { Inventory } from 'src/app/models/inventory.model';
import { Providers } from 'src/app/models/providers.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { PdfService } from 'src/app/services/pdf.service'; 
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-finance',
  templateUrl: './finance.page.html',
  styleUrls: ['./finance.page.scss'],
})
export class FinancePage implements OnInit {

  utilsService = inject(UtilsService);
  firebaseService = inject(FirebaseService);
  loading: boolean = false;

  costs: Costs[] = [];
  employees: Employees[] = [];
  inventory: Inventory[] = [];
  provider: Providers[] = [];
  
  constructor(private pdfService: PdfService) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.getEmployee();
    this.getCosts();
    this.getInventory();
    this.getProvider();
  }

  user(): User {
    return this.utilsService.getLocalStorage('user');
  }

  downloadFinancePDF() {
    this.pdfService.downloadPDF('finance-content', 'Reporte_Financiero');
  }

  getCosts() {
    let path = `costos/`;
    /* let path = `users/${this.user().uid}/costos`; */

    this.loading = true;

    let sub = this.firebaseService.getCollectionCosts(path)
      .snapshotChanges().pipe(
        map(changes => changes.map(c => ({
          id: c.payload.doc.id,
          ...c.payload.doc.data()
        })))
      ).subscribe({
        next: (resp: any) => {
          this.costs = resp

          this.loading = false;
          sub.unsubscribe();
        }
      })
  }

  getEmployee() {
    let path = `empleados/`;
    /* let path = `users/${this.user().uid}/empleados`; */

    this.loading = true;

    let sub = this.firebaseService.getCollectionData(path)
      .snapshotChanges().pipe(
        map(changes => changes.map(c => ({
          id: c.payload.doc.id,
          ...c.payload.doc.data()
        })))
      ).subscribe({
        next: (resp: any) => {
          this.employees = resp

          this.loading = false;
          sub.unsubscribe();
        }
      })
  }

  getInventory() {
    let path = `inventario/`;
    /* let path = `users/${this.user().uid}/inventario`; */ // Por si queremos dividir el inventario por usuario

    this.loading = true;

    let sub = this.firebaseService.getCollectionInventory(path)
      .snapshotChanges().pipe(
        map(changes => changes.map(c => ({
          id: c.payload.doc.id,
          ...c.payload.doc.data()
        })))
      ).subscribe({
        next: (resp: any) => {
          this.inventory = resp

          this.loading = false;
          sub.unsubscribe();
        }
      })
  }

  getProvider() {
    let path = `proveedores/`;
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
          this.provider = resp

          this.loading = false;
          sub.unsubscribe();
        }
      })
  }

  doRefresh(event: any) {
    setTimeout(() => {
      this.getCosts();
      event.target.complete();
    }, 1000);
  }
}