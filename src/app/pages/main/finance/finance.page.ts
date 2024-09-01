import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';
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
export class FinancePage implements OnInit, OnDestroy {

  private destroy$ = new Subject<void>();

  utilsService = inject(UtilsService);
  firebaseService = inject(FirebaseService);
  pdfService = inject(PdfService);

  loading = false;
  isPrinting = false;

  costs: Costs[] = [];
  employees: Employees[] = [];
  inventory: Inventory[] = [];
  provider: Providers[] = [];
  
  ngOnInit() {
    this.loadData();
  }

  ionViewWillEnter() {
    this.loadData();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  user(): User {
    return this.utilsService.getLocalStorage('user');
  }

  downloadFinancePDF() {
    this.isPrinting = true;
    setTimeout(() => {
      this.generatePDF();
      this.isPrinting = false;
    }, 1000);
  }

  generatePDF() {
    this.pdfService.downloadPDF('finance-content', 'Reporte_Financiero');
  }

  private loadData() {
    this.loading = true;
    this.getCosts();
    this.getEmployee();
    this.getInventory();
    this.getProvider();
  }

  private getCosts() {
    const path = `costos/`;
    this.firebaseService.getCollectionCosts(path)
      .snapshotChanges().pipe(
        map(changes => changes.map(c => ({
          id: c.payload.doc.id,
          ...c.payload.doc.data()
        }))),
        takeUntil(this.destroy$)
      ).subscribe({
        next: (resp: any) => {
          this.costs = resp;
          this.loading = false;
        }
      });
  }

  private getEmployee() {
    const path = `empleados/`;
    this.firebaseService.getCollectionData(path)
      .snapshotChanges().pipe(
        map(changes => changes.map(c => ({
          id: c.payload.doc.id,
          ...c.payload.doc.data()
        }))),
        takeUntil(this.destroy$)
      ).subscribe({
        next: (resp: any) => {
          this.employees = resp;
          this.loading = false;
        }
      });
  }

  private getInventory() {
    const path = `inventario/`;
    this.firebaseService.getCollectionInventory(path)
      .snapshotChanges().pipe(
        map(changes => changes.map(c => ({
          id: c.payload.doc.id,
          ...c.payload.doc.data()
        }))),
        takeUntil(this.destroy$)
      ).subscribe({
        next: (resp: any) => {
          this.inventory = resp;
          this.loading = false;
        }
      });
  }

  private getProvider() {
    const path = `proveedores/`;
    this.firebaseService.getCollectionRegister(path)
      .snapshotChanges().pipe(
        map(changes => changes.map(c => ({
          id: c.payload.doc.id,
          ...c.payload.doc.data()
        }))),
        takeUntil(this.destroy$)
      ).subscribe({
        next: (resp: any) => {
          this.provider = resp;
          this.loading = false;
        }
      });
  }

  doRefresh(event: any) {
    setTimeout(() => {
      this.loadData();
      event.target.complete();
    }, 1000);
  }
}
