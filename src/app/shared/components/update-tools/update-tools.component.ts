import { Component, inject, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Tools } from 'src/app/models/tools.models';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-update-tools',
  templateUrl: './update-tools.component.html',
  styleUrls: ['./update-tools.component.scss'],
})
export class UpdateToolsComponent  implements OnInit {

  @Input() tools: Tools;

  firebaseService = inject(FirebaseService);
  utilsService = inject(UtilsService);
  user= {} as User

  form = new FormGroup({
    id: new FormControl(''),
    elemento: new FormControl('', [Validators.required,]),
    costo: new FormControl(null, [Validators.required]),
    cantidad: new FormControl(null, [Validators.required]),
    garantia: new FormControl('', [Validators.required]),
    caracteristicas: new FormControl('', [Validators.required]),
    vida: new FormControl('', [Validators.required]),
    fecha: new FormControl('', [Validators.required]),
    img: new FormControl('', [Validators.required]),
  });

  ngOnInit() {
    this.user = this.utilsService.getLocalStorage('user');
    if(this.tools) this.form.setValue(this.tools);
  }

  setNumberInput(){
    let { costo } = this.form.controls;
    if (costo.value) costo.setValue(parseFloat(costo.value));
  }

  async submit() {
    if(this.form.valid){
      if(this.tools) this.updateTools();
      else this.createTools();
    }
  }

  async createTools() {
    let path = `herramientas`
    /* let path = `users/${this.user.uid}/herramientas` */

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
          message: 'Herramienta creada correctamente',
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

  async updateTools() {
    let path = `herramientas/${this.tools.id}`
    /* let path = `users/${this.user.uid}/herramientas/${this.tools.id}` */

    const loading = await this.utilsService.loading();
    await loading.present();

    if(this.form.value.img !== this.tools.img){
      let dataUrl = this.form.value.img;
      let imgPath = await this.firebaseService.getFilePath(this.tools.img);
      let imgUrl = await this.firebaseService.updateImage(imgPath, dataUrl);

      this.form.controls.img.setValue(imgUrl);
    }

    delete this.form.value.id;

    this.firebaseService.updateDocument(path, this.form.value)
      .then( async resp =>{

        this.utilsService.dismissModal({ succes: true });

        this.utilsService.presentToast({
          message: 'Herramienta actualizada correctamente',
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
    const dataUrl = (await this.utilsService.takePicture('Imagen de la herramienta')).dataUrl// Extraer la respuesta
    this.form.controls.img.setValue(dataUrl)
  }

}
