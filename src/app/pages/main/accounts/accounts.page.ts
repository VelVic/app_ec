import { Component, inject, OnInit } from '@angular/core';
import { map } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { UpdateAccountsComponent } from 'src/app/shared/components/update-accounts/update-accounts.component';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.page.html',
  styleUrls: ['./accounts.page.scss'],
})
export class AccountsPage implements OnInit {

  utilsService = inject(UtilsService);
  firebaseService = inject(FirebaseService);
  loading: boolean = false;
  users: User[] = [];
  ngOnInit() {
    this.getUser();
  }

  ionViewWillEnter() {
    this.getUser();
  }

  async addUpdateUser(users?: User) {
    let modal = await this.utilsService.getModal({
      component: UpdateAccountsComponent,
      cssClass: 'add-update-account',
      componentProps: { users }
    })
    if (modal) this.getUser();
  }

  user(): User {
    return this.utilsService.getLocalStorage('user');
  }

  getUser() {
    let path = `users/`;
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
          this.users = resp

          this.loading = false;
          sub.unsubscribe();
        }
      })
  }

  doRefresh(event: any) {
    setTimeout(() => {
      this.getUser();
      event.target.complete();
    }, 1000);
  }

  async deleteUser(user: User) {
    const path = `users/${user.uid}`;
    const loading = await this.utilsService.loading();
  
    try {
      await loading.present();
  
      // Verifica si la imagen es personalizada y está en Firebase Storage
      if (user.img && user.img !== 'assets/img/icono_ec.png') {
        const imgPath = await this.firebaseService.getFilePath(user.img);
        await this.firebaseService.deleteFile(imgPath);
      }
  
      // Elimina el documento del usuario
      await this.firebaseService.deleteDocument(path);
  
      // Actualiza la lista de usuarios local
      this.users = this.users.filter(existingUser => existingUser.uid !== user.uid);
  
      // Muestra mensajes de éxito
      this.utilsService.presentToast({
        message: 'Cuenta eliminada correctamente',
        duration: 2500,
        color: 'success',
        position: 'bottom',
        icon: 'checkmark-circle-outline',
      });
  
      // Esperar a que termine la duración del primer mensaje
      await new Promise(resolve => setTimeout(resolve, 2500));
  
      this.utilsService.presentToast({
        message: 'Recuerda eliminarlo de la base de datos de autenticación',
        duration: 2500,
        color: 'warning',
        position: 'bottom',
        icon: 'warning-outline',
      });
  
      // Cierra el modal con éxito
      this.utilsService.dismissModal({ success: true });
  
    } catch (error) {
      // Manejo de errores
      console.error('Error al eliminar la cuenta:', error);
  
      this.utilsService.presentToast({
        message: error.message || 'Ocurrió un error al eliminar la cuenta',
        duration: 2500,
        color: 'danger',
        position: 'bottom',
        icon: 'alert-circle-outline',
      });
  
    } finally {
      // Oculta el loading independientemente del resultado
      await loading.dismiss();
    }
  }
  
  async confirmDeletelUser(users: User) {
    this.utilsService.presentAlert({
      header: 'Eliminar cuenta',
      message: '¿Estás seguro de eliminar esta cuenta?',
      mode: 'ios',
      buttons: [
        {
          text: 'Cancelar'
        }
        , {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            this.deleteUser(users);
          }
        }]
    })
  }

  getAdmin(): number {
    if (!this.users || this.users.length === 0) return 0;
    // Filtra los trabajos que están en estado 'revisando' o 'reparando'
    return this.users.filter(job => job.tipo === 'admin').length;
  }

  getNormal(): number {
    if (!this.users || this.users.length === 0) return 0;
    // Filtra los trabajos que están en estado 'revisando' o 'reparando'
    return this.users.filter(job => job.tipo === 'user').length;
  }
}