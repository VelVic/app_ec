import { Component, inject, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { Registers } from 'src/app/models/registers.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { UpdateRegisterComponent } from 'src/app/shared/components/update-register/update-register.component';

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

  getRegister() {
    let path = `users/${this.user().uid}/registros`;

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
    let path = `users/${this.user().uid}/registros/${register.id}`

    const loading = await this.utilsService.loading();
    await loading.present();

    let imgPath = await this.firebaseService.getFilePath(register.img);
    await this.firebaseService.deleteFile(imgPath);

    this.firebaseService.deleteDocument(path)
      .then(async resp => {

        //Actualizar la lista de empleados
        this.register = this.register.filter(e => e.id !== register.id);

        this.utilsService.dismissModal({ succes: true });

        this.utilsService.presentToast({
          message: 'Registro eliminado correctamente',
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

  async confirmDeleteRegister(register: Registers) {
    this.utilsService.presentAlert({
      header: 'Eliminar registro',
      message: '¿Estás seguro de eliminar este registro?',
      mode: 'ios',
      buttons: [
        {
          text: 'Cancelar'
        }
        , {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            this.deleteRegister(register);
          }
        }]
    })
  }

  getBills() {
    return this.register.reduce((index, register) => index + register.costo, 0);
  }

  getPendings() {
    return this.register.reduce((index, register) => index + register.estado !== 'Entregado' ? 1 : 0, 0);
  }
}