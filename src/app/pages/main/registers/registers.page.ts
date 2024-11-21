import { Component, inject, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { Registers } from 'src/app/models/registers.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { UpdateRegisterComponent } from 'src/app/shared/components/update-register/update-register.component';
import { ViewRegisterComponent } from 'src/app/shared/components/view-register/view-register.component';

@Component({
  selector: 'app-registers',
  templateUrl: './registers.page.html',
  styleUrls: ['./registers.page.scss'],
})
export class RegistersPage implements OnInit {

  utilsService = inject(UtilsService);
  firebaseService = inject(FirebaseService);
  loading: boolean = false;
  register: Registers[] = [];

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.getRegister();
  }

  async addUpdateRegister(register?: Registers) {
    let modal = await this.utilsService.getModal({
      component: UpdateRegisterComponent,
      cssClass: 'add-update-register',
      componentProps: { register }
    })
    if (modal) this.getRegister();
  }

  user(): User {
    return this.utilsService.getLocalStorage('user');
  }

  async viewRegister(register?: Registers) {
    await this.utilsService.getModal({
      component: ViewRegisterComponent,
      cssClass: 'add-view-register',
      componentProps: { register }
    })
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

  doRefresh(event: any) {
    setTimeout(() => {
      this.getRegister();
      event.target.complete();
    }, 1000);
  }

  async deleteRegister(register: Registers) {
    const path = `registros/${register.id}`;
    const loading = await this.utilsService.loading();
  
    try {
      await loading.present();
  
      // Verificar si hay una imagen asociada y eliminarla
      if (register.img) {
        const imgPath = await this.firebaseService.getFilePath(register.img);
        await this.firebaseService.deleteFile(imgPath);
      }
  
      // Eliminar el documento del registro
      await this.firebaseService.deleteDocument(path);
  
      // Actualizar la lista local de registros
      this.register = this.register.filter(existingRegister => existingRegister.id !== register.id);
  
      // Mostrar mensaje de éxito
      await this.utilsService.presentToast({
        message: 'Cliente eliminado correctamente',
        duration: 2500,
        color: 'success',
        position: 'bottom',
        icon: 'checkmark-circle-outline',
      });
  
      // Cerrar el modal con éxito
      this.utilsService.dismissModal({ success: true });
  
    } catch (error) {
      // Manejo de errores
      console.error('Error al eliminar el cliente:', error);
  
      this.utilsService.presentToast({
        message: error.message || 'Ocurrió un error al eliminar el cliente',
        duration: 2500,
        color: 'danger',
        position: 'bottom',
        icon: 'alert-circle-outline',
      });
  
    } finally {
      // Siempre ocultar el spinner de carga
      await loading.dismiss();
    }
  }
  
  async confirmDeleteRegister(register: Registers) {
    await this.utilsService.presentAlert({
      header: 'Eliminar cliente',
      message: '¿Estás seguro de eliminar este cliente?',
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
            await this.deleteRegister(register);
          },
        },
      ],
    });
  }  

  getBills() {
    return this.register.reduce((index, register) => index + register.costo, 0);
  }

  getPendings(): number {
    if (!this.register || this.register.length === 0) return 0;
    // Filtra los trabajos que están en estado 'revisando' o 'reparando'
    return this.register.filter(job => job.estado !== 'Entregado').length;
  }
}