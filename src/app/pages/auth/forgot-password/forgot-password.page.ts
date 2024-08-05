import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {
  firebaseService = inject(FirebaseService);
  utillsService = inject(UtilsService);

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email])
  });
  constructor() { }

  ngOnInit() {
  }

  async submit() {
    if (this.form.valid) {
      const loading = await this.utillsService.loading();

      await loading.present();

      this.firebaseService.sendRecoveryEmail(this.form.value.email)
        .then(resp => {
          this.utillsService.presentToast({
            message: 'Revise su correo para cambiar la contraseña',
            duration: 3000,
            color: 'primary',
            position: 'bottom',
            icon: 'mail-outline'
          })

          this.utillsService.routerLink(['/auth']);
          this.form.reset();

        }).catch(error => {
          console.log(error);
          this.utillsService.presentToast({
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
  }

}
