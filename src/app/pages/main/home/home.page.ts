import { Component, inject, OnInit } from '@angular/core';
import { map } from 'rxjs';
import { Employees } from 'src/app/models/employees.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { UpdateEmployeeComponent } from 'src/app/shared/components/update-employee/update-employee.component';
import { ViewEmployeeComponent } from 'src/app/shared/components/view-employee/view-employee.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  utilsService = inject(UtilsService);
  firebaseService = inject(FirebaseService);
  loading: boolean = false;
  employees: Employees[] = [];

  ngOnInit() {
    // this.getEmployee();
  }

  ionViewWillEnter() {
    this.getEmployee();
  }

  async addUpdateEmployee(employee?: Employees) {
    let modal = await this.utilsService.getModal({
      component: UpdateEmployeeComponent,
      cssClass: 'add-update-employee',
      componentProps: { employee }
    })
    if (modal) this.getEmployee();
  }

  user(): User {
    return this.utilsService.getLocalStorage('user');
  }

  async viewEmployee(employee?: Employees) {
    await this.utilsService.getModal({
      component: ViewEmployeeComponent,
      cssClass: 'add-view-employee',
      componentProps: { employee }
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

  doRefresh(event: any) {
    setTimeout(() => {
      this.getEmployee();
      event.target.complete();
    }, 1000);
  }

  async deleteEmployee(employee: Employees) {
    const path = `empleados/${employee.id}`;
    const loading = await this.utilsService.loading();

    try {
      await loading.present();

      // Verificar si existe una imagen asociada y eliminarla
      if (employee.img) {
        const imgPath = await this.firebaseService.getFilePath(employee.img);
        await this.firebaseService.deleteFile(imgPath);
      }

      // Eliminar el documento del empleado
      await this.firebaseService.deleteDocument(path);

      // Actualizar la lista local de empleados
      this.employees = this.employees.filter(existingEmployee => existingEmployee.id !== employee.id);

      // Mostrar mensaje de éxito
      await this.utilsService.presentToast({
        message: 'Empleado eliminado correctamente',
        duration: 2500,
        color: 'success',
        position: 'bottom',
        icon: 'checkmark-circle-outline',
      });

      // Cerrar el modal con éxito
      this.utilsService.dismissModal({ success: true });

    } catch (error) {
      // Manejo de errores
      console.error('Error al eliminar el empleado:', error);

      this.utilsService.presentToast({
        message: error.message || 'Ocurrió un error al eliminar al empleado',
        duration: 2500,
        color: 'danger',
        position: 'bottom',
        icon: 'alert-circle-outline',
      });

    } finally {
      // Ocultar el loading independientemente del resultado
      await loading.dismiss();
    }
  }

  async confirmDeleteEmployee(employee: Employees) {
    await this.utilsService.presentAlert({
      header: 'Eliminar empleado',
      message: '¿Estás seguro de eliminar este empleado?',
      mode: 'ios',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: async () => {
            await this.deleteEmployee(employee);
          },
        },
      ],
    });
  }

  getBills() {
    return this.employees.reduce((index, employees) => index + employees.salario, 0);
  }
}
