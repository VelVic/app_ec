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
export class UpdateAccountsComponent  implements OnInit {

  @Input() user: User;

  firebaseService = inject(FirebaseService);
  utilsService = inject(UtilsService);
  users= {} as User

  form = new FormGroup({
    uid: new FormControl(''),
    email: new FormControl('', [Validators.required, Validators.email]),
    tipo: new FormControl('', [Validators.required, Validators.minLength(3)]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    name: new FormControl('', [Validators.required, Validators.minLength(3)])
  });

  ngOnInit() {
    this.user = this.utilsService.getLocalStorage('user');
    if(this.user) this.form.setValue(this.user);
  }

  async submit() {
    if(this.form.valid){
      if(this.user) this.updateUser();
      else this.createUser();
    }
  }

  async createUser() {
    let path = `users`
    /* let path = `users/${this.user.uid}/registros` */

    const loading = await this.utilsService.loading();
    await loading.present();
  
    let dataUrl = this.form.value.uid;
    let imgPath = `${this.user.uid}/${Date.now()}}`;
    let imgUrl = await this.firebaseService.updateImage(imgPath, dataUrl);

    this.form.controls.uid.setValue(imgUrl);
    
    delete this.form.value.uid;

    this.firebaseService.addDocument(path, this.form.value)
      .then( async resp =>{

        this.utilsService.dismissModal({ succes: true });

        this.utilsService.presentToast({
          message: 'Cuenta creada correctamente',
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

  async updateUser() {
    let path = `users/${this.user.uid}`
    /* let path = `users/${this.user.uid}/registros/${this.user.id}` */

    const loading = await this.utilsService.loading();
    await loading.present();

    if(this.form.value.uid !== this.user.img){
      let dataUrl = this.form.value.uid;
      let imgPath = await this.firebaseService.getFilePath(this.user.img);
      let imgUrl = await this.firebaseService.updateImage(imgPath, dataUrl);

      this.form.controls.uid.setValue(imgUrl);
    }

    delete this.form.value.uid;

    this.firebaseService.updateDocument(path, this.form.value)
      .then( async resp =>{

        this.utilsService.dismissModal({ succes: true });

        this.utilsService.presentToast({
          message: 'Cuenta actualizada correctamente',
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

  async takeImage() {
    const dataUrl = (await this.utilsService.takePicture('Imagen de la cuenta')).dataUrl// Extraer la respuesta
    this.form.controls.uid.setValue(dataUrl)
  }

}
