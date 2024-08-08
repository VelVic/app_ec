import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Registers } from 'src/app/models/registers.model';
import { User } from 'src/app/models/user.model';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-view-register',
  templateUrl: './view-register.component.html',
  styleUrls: ['./view-register.component.scss'],
})
export class ViewRegisterComponent  implements OnInit {

  @Input() register: Registers;
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

  constructor(private utilsService: UtilsService) { }

  ngOnInit() {
    this.user = this.utilsService.getLocalStorage('user');
    if(this.register) this.form.setValue(this.register);
  }
}