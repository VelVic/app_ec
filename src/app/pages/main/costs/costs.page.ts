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
    let path = `costos/${costs.id}`
    /* let path = `users/${this.user().uid}/costos/${costs.id}` */

    const loading = await this.utilsService.loading();
    await loading.present();

    let imgPath = await this.firebaseService.getFilePath(costs.img);
    await this.firebaseService.deleteFile(imgPath);

    this.firebaseService.deleteDocument(path)
      .then(async resp => {

        //Actualizar la lista de empleados
        this.costs = this.costs.filter(e => e.id !== costs.id);

        this.utilsService.dismissModal({ succes: true });

        this.utilsService.presentToast({
          message: 'Elemento eliminado correctamente',
          duration: 2500,
          color: 'success',
          position: 'bottom',
          icon: 'checkmark-circle-outline'
        })
        this.utilsService.dismissModal(true);
      }).catch(error => {
        console.log(error);
        this.utilsService.presentToast({
          message: error.message,
          duration: 2500,
          color: 'danger',
          position: 'bottom',
          icon: 'alert-circle-outline'
        })
      }).finally(() => {
        loading.dismiss();
      });
  }

  async confirmDeleteCosts(costs: Costs) {
    this.utilsService.presentAlert({
      header: 'Eliminar elemento',
      message: '¿Estás seguro de eliminar este elemento?',
      mode: 'ios',
      buttons: [
        {
          text: 'Cancelar'
        }
        , {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            this.deleteCosts(costs);
          }
        }]
    })
  }

  getBills() {
    return this.costs.reduce((index, employees) => index + employees.importe, 0);
  }

}
