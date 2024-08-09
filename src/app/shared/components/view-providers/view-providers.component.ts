import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Providers } from 'src/app/models/providers.model';
import { User } from 'src/app/models/user.model';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-view-providers',
  templateUrl: './view-providers.component.html',
  styleUrls: ['./view-providers.component.scss'],
})
export class ViewProvidersComponent  implements OnInit {

  @Input() provider: Providers;

  user = {} as User

  form = new FormGroup({
    id: new FormControl('',),
    nombre: new FormControl('', [Validators.required]),
    telefono: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required]),
    notas: new FormControl('', [Validators.required]),
    fecha: new FormControl('', [Validators.required]),
    activo: new FormControl('', [Validators.required]),
    img: new FormControl('', [Validators.required]),
  });

  constructor(private utilsService: UtilsService) {}

  ngOnInit() {
    this.user = this.utilsService.getLocalStorage('user');
    if (this.provider) this.form.setValue(this.provider);
  }
}