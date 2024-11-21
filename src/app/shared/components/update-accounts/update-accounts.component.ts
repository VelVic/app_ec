import { Component, inject, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-update-accounts',
  templateUrl: './update-accounts.component.html',
  styleUrls: ['./update-accounts.component.scss'],
})
export class UpdateAccountsComponent implements OnInit {

  users = {} as User;

  utillsService = inject(UtilsService);
  firebaseService = inject(FirebaseService);

  form = new FormGroup({
    uid: new FormControl(''),
    email: new FormControl('', [Validators.required, Validators.email]),
    tipo: new FormControl('', [Validators.required, Validators.minLength(3)]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    img: new FormControl('')
  });

  constructor() { }

  ngOnInit() {}

  user(): User {
    return this.utillsService.getLocalStorage('user');
  }

  async submit() {
    if (this.form.valid) {
      const loading = await this.utillsService.loading();

      await loading.present();

      // Verificar si la imagen está vacía y asignar una imagen por defecto si es necesario
      if (!this.form.value.img) {
        this.form.controls.img.setValue('assets/img/icono_ec.png');  // URL de la imagen por defecto
      }

      this.firebaseService.singUp(this.form.value as User)
        .then(async resp => {
          await this.firebaseService.updateUser(this.form.value.name);

          let uid = resp.user.uid;
          this.form.controls.uid.setValue(uid);
          // Se realiza el seteo de la información del usuario
          await this.setUserInfo(uid);

        }).catch(error => {
          console.log(error);
          this.utillsService.presentToast({
            message: error.message || 'Hubo un error al registrar el usuario',
            duration: 2500,
            color: 'danger',
            position: 'bottom',
            icon: 'alert-circle-outline'
          });
        }).finally(async () => {
          loading.dismiss();
        });
    }
  }

  async setUserInfo(uid: string) {
    if (this.form.valid) {
      const loading = await this.utillsService.loading();

      await loading.present();

      let path = `users/${uid}`;
      delete this.form.value.password;

      this.firebaseService.setDocument(path, this.form.value)
        .then(async resp => {
          this.utillsService.savelocalStorage('user', this.form.value);
          this.utillsService.routerLink('main/profile');
          this.utillsService.presentToast({
            message: 'Verificación de creación correcta',
            duration: 2500,
            color: 'success',
            position: 'bottom',
            icon: 'checkmark-circle-outline'
          });
          this.form.reset();

          // Cerrar el modal después de un registro exitoso
          this.utillsService.dismissModal({ success: true });

        }).catch(error => {
          console.log(error);
          this.utillsService.presentToast({
            message: error.message,
            duration: 2500,
            color: 'danger',
            position: 'bottom',
            icon: 'alert-circle-outline'
          });
        }).finally(() => {
          loading.dismiss();
        });
    }
  }
}
