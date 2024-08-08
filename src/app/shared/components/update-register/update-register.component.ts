import { Component, inject, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Registers } from 'src/app/models/registers.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-update-register',
  templateUrl: './update-register.component.html',
  styleUrls: ['./update-register.component.scss'],
})
export class UpdateRegisterComponent  implements OnInit {

  @Input() register: Registers;

  firebaseService = inject(FirebaseService);
  utilsService = inject(UtilsService);
  user= {} as User

  form = new FormGroup({
    id: new FormControl(''),
    registro: new FormControl('', [Validators.required,]),
    fecha: new FormControl('', [Validators.required]),
    tipo: new FormControl('', [Validators.required]),
    descripcion: new FormControl('', [Validators.required]),
    img: new FormControl('', [Validators.required]),
    telefono: new FormControl('', [Validators.required]),
    domicilio: new FormControl('', [Validators.required]),
    estado: new FormControl('', [Validators.required]),
    encargado: new FormControl('', [Validators.required]),
    costo: new FormControl(null, [Validators.required]),
  });

  ngOnInit() {
    this.user = this.utilsService.getLocalStorage('user');
    if(this.register) this.form.setValue(this.register);
  }

  setNumberInput(){
    let { costo } = this.form.controls;
    if (costo.value) costo.setValue(parseFloat(costo.value));
  }

  async submit() {
    if(this.form.valid){
      if(this.register) this.updateRegister();
      else this.createRegister();
    }
  }

  async createRegister() {
    let path = `registros`
    /* let path = `users/${this.user.uid}/registros` */

    const loading = await this.utilsService.loading();
    await loading.present();
  
    let dataUrl = this.form.value.img;
    let imgPath = `${this.user.uid}/${Date.now()}}`;
    let imgUrl = await this.firebaseService.updateImage(imgPath, dataUrl);

    this.form.controls.img.setValue(imgUrl);
    
    delete this.form.value.id;

    this.firebaseService.addDocument(path, this.form.value)
      .then( async resp =>{

        this.utilsService.dismissModal({ succes: true });

        this.utilsService.presentToast({
          message: 'Registro creado correctamente',
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

  async updateRegister() {
    let path = `registros/${this.register.id}`
    /* let path = `users/${this.user.uid}/registros/${this.register.id}` */

    const loading = await this.utilsService.loading();
    await loading.present();

    if(this.form.value.img !== this.register.img){
      let dataUrl = this.form.value.img;
      let imgPath = await this.firebaseService.getFilePath(this.register.img);
      let imgUrl = await this.firebaseService.updateImage(imgPath, dataUrl);

      this.form.controls.img.setValue(imgUrl);
    }

    delete this.form.value.id;

    this.firebaseService.updateDocument(path, this.form.value)
      .then( async resp =>{

        this.utilsService.dismissModal({ succes: true });

        this.utilsService.presentToast({
          message: 'Registro actualizado correctamente',
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
    const dataUrl = (await this.utilsService.takePicture('Imagen del registro')).dataUrl// Extraer la respuesta
    this.form.controls.img.setValue(dataUrl)
  }

}