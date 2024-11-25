import { Component, inject, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { Providers } from 'src/app/models/providers.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { UpdateProvidersComponent } from 'src/app/shared/components/update-providers/update-providers.component';
import { ViewProvidersComponent } from 'src/app/shared/components/view-providers/view-providers.component';

@Component({
  selector: 'app-providers',
  templateUrl: './providers.page.html',
  styleUrls: ['./providers.page.scss'],
})
export class ProvidersPage implements OnInit {

  utilsService = inject(UtilsService);
  firebaseService = inject(FirebaseService);
  loading: boolean = false;
  provider: Providers[] = [];

  ngOnInit() {
    this.getProvider();
  }

  ionViewWillEnter() {
    this.getProvider();
  }

  async addUpdateProvider(provider?: Providers) {
    let modal = await this.utilsService.getModal({
      component: UpdateProvidersComponent,
      cssClass: 'add-update-provider',
      componentProps: { provider }
    })
    if (modal) this.getProvider();
  }

  user(): User {
    return this.utilsService.getLocalStorage('user');
  }

  async viewProvider(provider?: Providers) {
    await this.utilsService.getModal({
      component: ViewProvidersComponent,
      cssClass: 'add-view-provider',
      componentProps: { provider }
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
      this.getProvider();
      event.target.complete();
    }, 1000);
  }

  async deleteRegister(provider: Providers) {
    let path = `proveedores/${provider.id}`
    /* let path = `users/${this.user().uid}/registros/${provider.id}` */

    const loading = await this.utilsService.loading();
    await loading.present();

    let imgPath = await this.firebaseService.getFilePath(provider.img);
    await this.firebaseService.deleteFile(imgPath);

    this.firebaseService.deleteDocument(path)
      .then(async resp => {

        //Actualizar la lista de empleados
        this.provider = this.provider.filter(e => e.id !== provider.id);

        this.utilsService.dismissModal({ succes: true });

        this.utilsService.presentToast({
          message: 'Proveedor eliminado correctamente',
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

  async confirmDeleteProvider(provider: Providers) {
    this.utilsService.presentAlert({
      header: 'Eliminar proveedor',
      message: '¿Estás seguro de eliminar este proveedor?',
      mode: 'ios',
      buttons: [
        {
          text: 'Cancelar'
        }
        , {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            this.deleteRegister(provider);
          }
        }]
    })
  }

  getActivos(): number {
    if (!this.provider || this.provider.length === 0) return 0;
    // Filtra los trabajos que están en estado 'revisando' o 'reparando'
    return this.provider.filter(job => job.activo !== 'No').length;
  }

  getInactivos(): number {
    if (!this.provider || this.provider.length === 0) return 0;
    // Filtra los trabajos que están en estado 'revisando' o 'reparando'
    return this.provider.filter(job => job.activo === 'No').length;
  }
}