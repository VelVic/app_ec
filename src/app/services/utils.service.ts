import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, AlertOptions, LoadingController, ModalController, ModalOptions, ToastController, ToastOptions } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  router = inject(Router);
  toastCtrl = inject(ToastController);
  loadingCtrl = inject(LoadingController);
  modalCtrl = inject(ModalController);
  alertCtrl = inject(AlertController);

  routerLink(url:any){
    this.router.navigateByUrl(url);
  }

  loading(){
    return this.loadingCtrl.create({ 
      spinner : 'crescent',
      message: 'Cargando...',
      translucent: true,});
  }

  async presentToast(opts?: ToastOptions){
    const toast = await this.toastCtrl.create(opts);
    
    toast.present();
  }

  savelocalStorage(key: string, value: any){
    return localStorage.setItem(key, JSON.stringify(value));
  }
  
  getLocalStorage(key: string){
    return JSON.parse(localStorage.getItem(key));
  }

  async getModal(opts: ModalOptions){
    const modal = await this.modalCtrl.create(opts);
    await modal.present();

    const { data } = await modal.onWillDismiss();
    if(data) return data;
  }

  dismissModal(data?: any){
    return this.modalCtrl.dismiss(data);
  }

  async takePicture(promptLabelHeader: string) {
    return await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Prompt, //Opcion a elegir entre camara o galeria
      promptLabelHeader,
      promptLabelPhoto: 'Seleccionar una imagen',
      promptLabelPicture: 'Tomar una foto',
    });
  };

  async presentAlert(opts?: AlertOptions){
    const alert = await this.alertCtrl.create(opts);
    await alert.present();
  }
}
