import { Component, inject, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Employees } from 'src/app/models/employees.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-update-employee',
  templateUrl: './update-employee.component.html',
  styleUrls: ['./update-employee.component.scss'],
})
export class UpdateEmployeeComponent implements OnInit {

  @Input() employee: Employees;

  firebaseService = inject(FirebaseService);
  utilsService = inject(UtilsService);
  user= {} as User

  form = new FormGroup({
    id: new FormControl(''),
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    lastname: new FormControl('', [Validators.required, Validators.minLength(3)]),
    salario: new FormControl(null, [Validators.required, Validators.min(0)]),
    domicilio: new FormControl('', [Validators.required]),
    cargo: new FormControl('', [Validators.required]),
    img: new FormControl('', [Validators.required]),
    telefono: new FormControl('', [Validators.required]),
  });

  ngOnInit() {
    this.user = this.utilsService.getLocalStorage('user');
    if(this.employee) this.form.setValue(this.employee);
  }

  setNumberInput(){
    let { salario } = this.form.controls;
    if (salario.value) salario.setValue(parseFloat(salario.value));
  }

  async submit() {
    if(this.form.valid){
      if(this.employee) this.updateEmployee();
      else this.createEmployee();
    }
  }

  async createEmployee() {
    let path = `users/${this.user.uid}/empleados`

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
          message: 'Empleado creado correctamente',
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

  async updateEmployee() {
    let path = `users/${this.user.uid}/empleados/${this.employee.id}`

    const loading = await this.utilsService.loading();
    await loading.present();

    if(this.form.value.img !== this.employee.img){
      let dataUrl = this.form.value.img;
      let imgPath = await this.firebaseService.getFilePath(this.employee.img);
      let imgUrl = await this.firebaseService.updateImage(imgPath, dataUrl);

      this.form.controls.img.setValue(imgUrl);
    }

    delete this.form.value.id;

    this.firebaseService.updateDocument(path, this.form.value)
      .then( async resp =>{

        this.utilsService.dismissModal({ succes: true });

        this.utilsService.presentToast({
          message: 'Empleado actualizado correctamente',
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
    const dataUrl = (await this.utilsService.takePicture('Imagen del empleado')).dataUrl// Extraer la respuesta
    this.form.controls.img.setValue(dataUrl)
  }

}
