import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Costs } from 'src/app/models/costs.models';
import { User } from 'src/app/models/user.model';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-view-costs',
  templateUrl: './view-costs.component.html',
  styleUrls: ['./view-costs.component.scss'],
})
export class ViewCostsComponent  implements OnInit {

  @Input() costs: Costs;
  user = {} as User;

  form = new FormGroup({
    id: new FormControl(''),
    elemento: new FormControl('', [Validators.required,]),
    importe: new FormControl(null, [Validators.required]),
    fecha: new FormControl('', [Validators.required]),
    img: new FormControl('', [Validators.required]),
  });
  
  constructor(private utilsService: UtilsService) {}
  
  ngOnInit() {
    this.user = this.utilsService.getLocalStorage('user');
    if (this.costs) this.form.setValue(this.costs);
  }
}
