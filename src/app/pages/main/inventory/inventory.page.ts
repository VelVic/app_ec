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
    this.getInventory();
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
    const path = `inventario/${inventory.id}`;
    const loading = await this.utilsService.loading();
  
    try {
      await loading.present();
  
      // Verificar si hay una imagen asociada y eliminarla
      if (inventory.img) {
        const imgPath = await this.firebaseService.getFilePath(inventory.img);
        await this.firebaseService.deleteFile(imgPath);
      }
  
      // Eliminar el documento del inventario
      await this.firebaseService.deleteDocument(path);
  
      // Actualizar la lista de inventario
      this.inventory = this.inventory.filter(item => item.id !== inventory.id);
  
      // Mostrar mensaje de éxito
      await this.utilsService.presentToast({
        message: 'Producto eliminado correctamente',
        duration: 2500,
        color: 'success',
        position: 'bottom',
        icon: 'checkmark-circle-outline',
      });
  
      // Cerrar modal con resultado exitoso
      this.utilsService.dismissModal({ success: true });
  
    } catch (error) {
      // Manejar errores
      console.error('Error al eliminar el producto del inventario:', error);
  
      this.utilsService.presentToast({
        message: error.message || 'Ocurrió un error al eliminar el producto',
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
  
  async confirmDeleteInventory(inventory: Inventory) {
    await this.utilsService.presentAlert({
      header: 'Eliminar producto',
      message: '¿Estás seguro de eliminar este producto?',
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
            await this.deleteInventory(inventory);
          },
        },
      ],
    });
  }
  

  getBills() {
    return this.inventory.reduce((index, inventory) => index + inventory.costo * inventory.cantidad, 0);
  }

}
