import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Inventory } from 'src/app/models/inventory.model';
import { User } from 'src/app/models/user.model';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-view-inventory',
  templateUrl: './view-inventory.component.html',
  styleUrls: ['./view-inventory.component.scss'],
})
export class ViewInventoryComponent implements OnInit {

  @Input() inventory: Inventory;
  user = {} as User;

  form = new FormGroup({
    id: new FormControl(''),
    elemento: new FormControl(''),
    tipo: new FormControl(''),
    modelo: new FormControl(''),
    cantidad: new FormControl(null),
    costo: new FormControl(null),
    fecha: new FormControl(''),
    img: new FormControl(''),
  });

  constructor(private utilsService: UtilsService) {}

  ngOnInit() {
    this.user = this.utilsService.getLocalStorage('user');
    if (this.inventory) this.form.setValue(this.inventory);
  }

}
