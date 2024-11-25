import { Component, inject, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { Tools } from 'src/app/models/tools.models';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { UpdateToolsComponent } from 'src/app/shared/components/update-tools/update-tools.component';
import { ViewToolsComponent } from 'src/app/shared/components/view-tools/view-tools.component';

@Component({
  selector: 'app-tools',
  templateUrl: './tools.page.html',
  styleUrls: ['./tools.page.scss'],
})
export class ToolsPage implements OnInit {

  utilsService = inject(UtilsService);
  firebaseService = inject(FirebaseService);
  loading: boolean = false;
  tools: Tools[] = [];

  ngOnInit() {
    this.getTools();
  }

  ionViewWillEnter() {
    this.getTools();
  }

  async addUpdateTools(tools?: Tools) {
    let modal = await this.utilsService.getModal({
      component: UpdateToolsComponent,
      cssClass: 'add-update-tools',
      componentProps: { tools }
    })
    if (modal) this.getTools();
  }

  user(): User {
    return this.utilsService.getLocalStorage('user');
  }

  async viewTools(tools?: Tools) {
    await this.utilsService.getModal({
      component: ViewToolsComponent,
      cssClass: 'add-view-tools',
      componentProps: { tools }
    })
  }

  getTools() {
    let path = `herramientas/`;
    /* let path = `users/${this.user().uid}/herramientas`; */

    this.loading = true;

    let sub = this.firebaseService.getCollectionTools(path)
      .snapshotChanges().pipe(
        map(changes => changes.map(c => ({
          id: c.payload.doc.id,
          ...c.payload.doc.data()
        })))
      ).subscribe({
        next: (resp: any) => {
          this.tools = resp

          this.loading = false;
          sub.unsubscribe();
        }
      })
  }

  doRefresh(event: any) {
    setTimeout(() => {
      this.getTools();
      event.target.complete();
    }, 1000);
  }

  async deleteTools(tools: Tools) {
    const path = `herramientas/${tools.id}`;
    const loading = await this.utilsService.loading();
  
    try {
      await loading.present();
  
      // Verificar y eliminar la imagen asociada si existe
      if (tools.img) {
        const imgPath = await this.firebaseService.getFilePath(tools.img);
        await this.firebaseService.deleteFile(imgPath);
      }
  
      // Eliminar el documento de herramientas
      await this.firebaseService.deleteDocument(path);
  
      // Actualizar la lista local de herramientas
      this.tools = this.tools.filter(item => item.id !== tools.id);
  
      // Mostrar mensaje de éxito
      await this.utilsService.presentToast({
        message: 'Herramienta eliminada correctamente',
        duration: 2500,
        color: 'success',
        position: 'bottom',
        icon: 'checkmark-circle-outline',
      });
  
      // Cerrar el modal indicando éxito
      this.utilsService.dismissModal({ success: true });
  
    } catch (error) {
      // Manejar errores y mostrar mensajes
      console.error('Error al eliminar herramienta:', error);
  
      await this.utilsService.presentToast({
        message: error.message || 'Ocurrió un error al eliminar la herramienta',
        duration: 2500,
        color: 'danger',
        position: 'bottom',
        icon: 'alert-circle-outline',
      });
  
    } finally {
      // Asegurar cierre del spinner
      await loading.dismiss();
    }
  }
  
  async confirmDeleteTools(tools: Tools) {
    await this.utilsService.presentAlert({
      header: 'Eliminar herramienta',
      message: '¿Estás seguro de eliminar esta herramienta?',
      mode: 'ios',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: async () => {
            await this.deleteTools(tools);
          },
        },
      ],
    });
  }  

  getBills() {
    return this.tools.reduce((index, tools) => index + tools.costo * tools.cantidad, 0);
  }

}
