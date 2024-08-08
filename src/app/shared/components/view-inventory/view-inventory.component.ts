import { Component, inject, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Inventory } from 'src/app/models/inventory.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-view-inventory',
  templateUrl: './view-inventory.component.html',
  styleUrls: ['./view-inventory.component.scss'],
})
export class ViewInventoryComponent  implements OnInit {

  @Input() inventory: Inventory;

  firebaseService = inject(FirebaseService);
  utilsService = inject(UtilsService);
  user = {} as User

  form = new FormGroup({
    id: new FormControl(''),
    elemento: new FormControl('', [Validators.required,]),
    tipo: new FormControl('', [Validators.required]),
    modelo: new FormControl('', [Validators.required]),
    cantidad: new FormControl(null, [Validators.required]),
    costo: new FormControl(null, [Validators.required]),
    fecha: new FormControl('', [Validators.required]),
    img: new FormControl('', [Validators.required]),
  });
  
  ngOnInit() {
    this.user = this.utilsService.getLocalStorage('user');
    if (this.inventory) this.form.setValue(this.inventory);
  }

  setNumberInput() {
    let { costo } = this.form.controls;
    if (costo.value) costo.setValue(parseFloat(costo.value));
  }

  async submit() {
    if (this.form.valid) {
      if (this.inventory) this.updateInventory();
      else this.createInventory();
    }
  }

  async createInventory() {
    let path = `inventario`;
    /* let path = `users/${this.user.uid}/inventario` */ // Por si queremos dividir el inventario por usuario

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

  async updateInventory() {
    let path = `inventario/${this.inventory.elemento}`;
    /* let path = `users/${this.user.uid}/inventario/${this.inventory.id}` */ // Por si queremos dividir el inventario por usuario

    const loading = await this.utilsService.loading();
    await loading.present();

    if (this.form.value.img !== this.inventory.img) {
      let dataUrl = this.form.value.img;
      let imgPath = await this.firebaseService.getFilePath(this.inventory.img);
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

