import { Component, inject, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { Inventory } from 'src/app/models/inventory.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { UpdateInventoryComponent } from 'src/app/shared/components/update-inventory/update-inventory.component';
import { ViewInventoryComponent } from 'src/app/shared/components/view-inventory/view-inventory.component';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.page.html',
  styleUrls: ['./inventory.page.scss'],
})
export class InventoryPage implements OnInit {

  utilsService = inject(UtilsService);
  firebaseService = inject(FirebaseService);
  loading: boolean = false;
  inventory: Inventory[] = [];

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.getInventory();
  }

  async addUpdateInventory(inventory?: Inventory) {
    let modal = await this.utilsService.getModal({
      component: UpdateInventoryComponent,
      cssClass: 'add-update-inventory',
      componentProps: { inventory }
    })
    if (modal) this.getInventory();
  }

  user(): User {
    return this.utilsService.getLocalStorage('user');
  }

  async viewInventory(inventory?: Inventory) {
    await this.utilsService.getModal({
      component: ViewInventoryComponent,
      cssClass: 'add-view-inventory',
      componentProps: { inventory }
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

  doRefresh(event: any) {
    setTimeout(() => {
      this.getInventory();
      event.target.complete();
    }, 1000);
  }

  async deleteInventory(inventory: Inventory) {
    let path = `inventario/${inventory.id}`;
    /* let path = `users/${this.user().uid}/inventario/${inventory.id}` */ // Por si queremos dividir el inventario por usuario

    const loading = await this.utilsService.loading();
    await loading.present();

    let imgPath = await this.firebaseService.getFilePath(inventory.img);
    await this.firebaseService.deleteFile(imgPath);

    this.firebaseService.deleteDocument(path)
      .then(async resp => {

        //Actualizar la lista de empleados
        this.inventory = this.inventory.filter(e => e.id !== inventory.id);

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

  async confirmDeleteInventory(inventory: Inventory) {
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
            this.deleteInventory(inventory);
          }
        }]
    })
  }

  getBills() {
    return this.inventory.reduce((index, inventory) => index + inventory.costo, 0);
  }

}
