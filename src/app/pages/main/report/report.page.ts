import { Component, inject, OnInit } from '@angular/core';
import { map, takeUntil } from 'rxjs';
import { Employees } from 'src/app/models/employees.model';
import { Providers } from 'src/app/models/providers.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { ReportEmployeeComponent } from 'src/app/shared/components/report-employee/report-employee.component';
import { Subject } from 'rxjs';
import { ReportProvidersComponent } from 'src/app/shared/components/report-providers/report-providers.component';
import { Costs } from 'src/app/models/costs.models';
import { Inventory } from 'src/app/models/inventory.model';
import { Registers } from 'src/app/models/registers.model';
import { Tools } from 'src/app/models/tools.models';
import { ReportAccountsComponent } from 'src/app/shared/components/report-accounts/report-accounts.component';
import { ReportCostsComponent } from 'src/app/shared/components/report-costs/report-costs.component';
import { ReportInventoryComponent } from 'src/app/shared/components/report-inventory/report-inventory.component';
import { ReportRegisterComponent } from 'src/app/shared/components/report-register/report-register.component';
import { ReportToolsComponent } from 'src/app/shared/components/report-tools/report-tools.component';

@Component({
  selector: 'app-report',
  templateUrl: './report.page.html',
  styleUrls: ['./report.page.scss'],
})
export class ReportPage implements OnInit {

  utilsService = inject(UtilsService);
  firebaseService = inject(FirebaseService);
  loading: boolean = false;

  cost: Costs[] = [];
  employee: Employees[] = [];
  inventory: Inventory[] = [];
  provider: Providers[] = [];
  register: Registers[] = [];
  tool: Tools[] = [];
  user: User[] = [];
  private unsubscribe$ = new Subject<void>();  // Para manejar la cancelación de suscripciones

  ngOnInit() {
    this.getAccount();
    this.getCost();
    this.getEmployee();
    this.getInventory();
    this.getProvider();
    this.getRegister();
    this.getTool();
  }

  ionViewWillEnter() { }

  users(): User {
    return this.utilsService.getLocalStorage('user'); // Obtiene el usuario del local storage para los roles
  }

  async viewAccount(user?: User) {
    await this.utilsService.getModal({
      component: ReportAccountsComponent,
      cssClass: 'report-account',
      componentProps: { user }
    });
  }

  async viewEmployee(employee?: Employees) {
    await this.utilsService.getModal({
      component: ReportEmployeeComponent,
      cssClass: 'report-employee',
      componentProps: { employee }
    });
  }

  // Función para mostrar el reporte de proveedores y actualizar la fecha
  async viewProvider(provider?: Providers) {
    await this.utilsService.getModal({
      component: ReportProvidersComponent,
      cssClass: 'report-provider',
      componentProps: { provider }
    });
  }

  async viewCost(cost?: Costs) {
    await this.utilsService.getModal({
      component: ReportCostsComponent,
      cssClass: 'report-cost',
      componentProps: { cost }
    });
  }

  async viewInventory(inventory?: Inventory) {
    await this.utilsService.getModal({
      component: ReportInventoryComponent,
      cssClass: 'report-inventory',
      componentProps: { inventory }
    });
  }

  async viewRegister(register?: Registers) {
    await this.utilsService.getModal({
      component: ReportRegisterComponent,
      cssClass: 'report-register',
      componentProps: { register }
    });
  }

  async viewTool(tool?: Tools) {
    await this.utilsService.getModal({
      component: ReportToolsComponent,
      cssClass: 'report-tool',
      componentProps: { tool }
    });
  }

  getAccount() {
    const path = `users/`;

    this.loading = true;

    this.firebaseService.getCollectionData(path)
      .snapshotChanges().pipe(
        map(changes => changes.length > 0 ? [{
          id: changes[0].payload.doc.id,
          ...changes[0].payload.doc.data()
        }] : []), // Verifica si hay datos y toma solo el primer item
        takeUntil(this.unsubscribe$)
      ).subscribe({
        next: (resp: any) => {
          this.user = resp;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error al cargar las cuentas:', err);
          this.loading = false;
        }
      });
  }

  getCost() {
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
          this.cost = resp;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error al cargar los costos:', err);
          this.loading = false;
        }
      });
  }

  getProvider() {
    const path = `proveedores/`;

    this.loading = true;

    this.firebaseService.getCollectionRegister(path)
      .snapshotChanges().pipe(
        map(changes => changes.length > 0 ? [{
          id: changes[0].payload.doc.id,
          ...changes[0].payload.doc.data()
        }] : []), // Verifica si hay datos y toma solo el primer item
        takeUntil(this.unsubscribe$)
      ).subscribe({
        next: (resp: any) => {
          this.provider = resp;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error al cargar proveedores:', err);
          this.loading = false;
        }
      });
  }

  getEmployee() {
    const path = `empleados/`;

    this.loading = true;

    this.firebaseService.getCollectionData(path)
      .snapshotChanges().pipe(
        map(changes => changes.length > 0 ? [{
          id: changes[0].payload.doc.id,
          ...changes[0].payload.doc.data()
        }] : []), // Verifica si tiene datos y toma el primer item
        takeUntil(this.unsubscribe$)
      ).subscribe({
        next: (resp: any) => {
          this.employee = resp;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error al cargar empleados:', err);
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
          console.error('Error al cargar el inventario:', err);
          this.loading = false;
        }
      });
  }

  getRegister() {
    const path = `registros/`;

    this.loading = true;

    this.firebaseService.getCollectionRegister(path)
      .snapshotChanges().pipe(
        map(changes => changes.length > 0 ? [{
          id: changes[0].payload.doc.id,
          ...changes[0].payload.doc.data()
        }] : []), // Verifica si tiene datos y toma el primer item
        takeUntil(this.unsubscribe$)
      ).subscribe({
        next: (resp: any) => {
          this.register = resp;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error al cargar los clientes:', err);
          this.loading = false;
        }
      });
  }

  getTool() {
    const path = 'herramientas/';
    this.firebaseService.getCollectionTools(path)
      .snapshotChanges()
      .pipe(
        map(changes => changes.map(c => ({
          id: c.payload.doc.id,
          ...c.payload.doc.data()
        })))
      )
      .subscribe({
        next: (resp: any) => {
          this.tool = resp;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error al cargar las herramientas:', err);
          this.loading = false;
        }
      });
  }

  // Función de refresco
  doRefresh(event: any) {
    setTimeout(() => {
      this.getProvider();
      this.getEmployee();
      event.target.complete();
    }, 1000);
  }

  // Para cancelar las suscripciones cuando el componente se destruye
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
