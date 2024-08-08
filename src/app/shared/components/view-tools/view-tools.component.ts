import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Tools } from 'src/app/models/tools.models';
import { User } from 'src/app/models/user.model';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-view-tools',
  templateUrl: './view-tools.component.html',
  styleUrls: ['./view-tools.component.scss'],
})
export class ViewToolsComponent  implements OnInit {

  @Input() tools: Tools;
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

  constructor(private utilsService: UtilsService) {}

  ngOnInit() {
    this.user = this.utilsService.getLocalStorage('user');
    if(this.tools) this.form.setValue(this.tools);
  }
}
