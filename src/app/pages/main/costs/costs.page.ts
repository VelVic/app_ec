import { Component, inject, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { Costs } from 'src/app/models/costs.models';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { UpdateCostsComponent } from 'src/app/shared/components/update-costs/update-costs.component';
import { ViewCostsComponent } from 'src/app/shared/components/view-costs/view-costs.component';

@Component({
  selector: 'app-costs',
  templateUrl: './costs.page.html',
  styleUrls: ['./costs.page.scss'],
})
export class CostsPage implements OnInit {

  utilsService = inject(UtilsService);
  firebaseService = inject(FirebaseService);
  loading: boolean = false;
  costs: Costs[] = [];

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.getCosts();
  }

  async addUpdateCosts(costs?: Costs) {
    let modal = await this.utilsService.getModal({
      component: UpdateCostsComponent,
      cssClass: 'add-update-costs',
      componentProps: { costs }
    })
    if (modal) this.getCosts();
  }

  user(): User {
    return this.utilsService.getLocalStorage('user');
  }

  async viewCosts(costs?: Costs) {
    await this.utilsService.getModal({
      component: ViewCostsComponent,
      cssClass: 'add-view-costs',
      componentProps: { costs }
    })
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

  doRefresh(event: any) {
    setTimeout(() => {
      this.getCosts();
      event.target.complete();
    }, 1000);
  }

  async deleteCosts(costs: Costs) {
    const path = `costos/${costs.id}`;
    const loading = await this.utilsService.loading();
  
    try {
      await loading.present();
  
      // Verificar si hay una imagen asociada y eliminarla
      if (costs.img) {
        const imgPath = await this.firebaseService.getFilePath(costs.img);
        await this.firebaseService.deleteFile(imgPath);
      }
  
      // Eliminar el documento del costo
      await this.firebaseService.deleteDocument(path);
  
      // Actualizar la lista de costos
      this.costs = this.costs.filter(item => item.id !== costs.id);
  
      // Mostrar mensaje de éxito
      await this.utilsService.presentToast({
        message: 'Servicio eliminado correctamente',
        duration: 2500,
        color: 'success',
        position: 'bottom',
        icon: 'checkmark-circle-outline',
      });
  
      // Cerrar modal con resultado exitoso
      this.utilsService.dismissModal({ success: true });
  
    } catch (error) {
      // Manejar errores
      console.error('Error al eliminar el servicio:', error);
  
      this.utilsService.presentToast({
        message: error.message || 'Ocurrió un error al eliminar el servicio',
        duration: 2500,
        color: 'danger',
        position: 'bottom',
        icon: 'alert-circle-outline',
      });
  
    } finally {
      // Asegurarse de cerrar el spinner de carga
      await loading.dismiss();
    }
  }
  
  async confirmDeleteCosts(costs: Costs) {
    await this.utilsService.presentAlert({
      header: 'Eliminar servicio',
      message: '¿Estás seguro de eliminar este servicio?',
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
            await this.deleteCosts(costs);
          },
        },
      ],
    });
  }
  
  

  getBills() {
    return this.costs.reduce((index, employees) => index + employees.importe, 0);
  }

}
