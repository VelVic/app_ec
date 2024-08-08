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
    let path = `herramientas/${tools.id}`
    /* let path = `users/${this.user().uid}/herramientas/${tools.id}` */

    const loading = await this.utilsService.loading();
    await loading.present();

    let imgPath = await this.firebaseService.getFilePath(tools.img);
    await this.firebaseService.deleteFile(imgPath);

    this.firebaseService.deleteDocument(path)
      .then(async resp => {

        //Actualizar la lista de empleados
        this.tools = this.tools.filter(e => e.id !== tools.id);

        this.utilsService.dismissModal({ succes: true });

        this.utilsService.presentToast({
          message: 'Herramienta eliminada correctamente',
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

  async confirmDeleteTools(tools: Tools) {
    this.utilsService.presentAlert({
      header: 'Eliminar herramienta',
      message: '¿Estás seguro de eliminar esta herramienta?',
      mode: 'ios',
      buttons: [
        {
          text: 'Cancelar'
        }
        , {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            this.deleteTools(tools);
          }
        }]
    })
  }

  getBills() {
    return this.tools.reduce((index, tools) => index + tools.costo, 0);
  }

}
