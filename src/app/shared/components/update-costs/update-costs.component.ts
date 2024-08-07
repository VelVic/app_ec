import { Component, inject, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Costs } from 'src/app/models/costs.models';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-update-costs',
  templateUrl: './update-costs.component.html',
  styleUrls: ['./update-costs.component.scss'],
})
export class UpdateCostsComponent  implements OnInit {

  @Input() costs: Costs;

  firebaseService = inject(FirebaseService);
  utilsService = inject(UtilsService);
  user = {} as User

  form = new FormGroup({
    id: new FormControl(''),
    elemento: new FormControl('', [Validators.required,]),
    importe: new FormControl(null, [Validators.required]),
    fecha: new FormControl('', [Validators.required]),
    img: new FormControl('', [Validators.required]),
  });
  
  ngOnInit() {
    this.user = this.utilsService.getLocalStorage('user');
    if (this.costs) this.form.setValue(this.costs);
  }

  setNumberInput() {
    let { importe } = this.form.controls;
    if (importe.value) importe.setValue(parseFloat(importe.value));
  }

  async submit() {
    if (this.form.valid) {
      if (this.costs) this.updateCosts();
      else this.createCosts();
    }
  }

  async createCosts() {
    let path = `users/${this.user.uid}/costos`

    const loading = await this.utilsService.loading();
    await loading.present();

    let dataUrl = this.form.value.img;
    let imgPath = `${this.user.uid}/${Date.now()}}`;
    let imgUrl = await this.firebaseService.updateImage(imgPath, dataUrl);

    this.form.controls.img.setValue(imgUrl);

    delete this.form.value.id;

    this.firebaseService.addDocument(path, this.form.value)
      .then(async resp => {

        this.utilsService.dismissModal({ succes: true });

        this.utilsService.presentToast({
          message: 'Elemento creado correctamente',
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

  async updateCosts() {
    let path = `users/${this.user.uid}/costos/${this.costs.id}`

    const loading = await this.utilsService.loading();
    await loading.present();

    if (this.form.value.img !== this.costs.img) {
      let dataUrl = this.form.value.img;
      let imgPath = await this.firebaseService.getFilePath(this.costs.img);
      let imgUrl = await this.firebaseService.updateImage(imgPath, dataUrl);

      this.form.controls.img.setValue(imgUrl);
    }

    delete this.form.value.id;

    this.firebaseService.updateDocument(path, this.form.value)
      .then(async resp => {

        this.utilsService.dismissModal({ succes: true });

        this.utilsService.presentToast({
          message: 'Elemento actualizado correctamente',
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
    const dataUrl = (await this.utilsService.takePicture('Imagen del elemento')).dataUrl// Extraer la respuesta
    this.form.controls.img.setValue(dataUrl)
  }

}
