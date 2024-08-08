import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Employees } from 'src/app/models/employees.model';
import { User } from 'src/app/models/user.model';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-view-employee',
  templateUrl: './view-employee.component.html',
  styleUrls: ['./view-employee.component.scss'],
})
export class ViewEmployeeComponent  implements OnInit {

  @Input() employee: Employees;

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
  
  constructor(private utilsService: UtilsService) {}
  
  ngOnInit() {
    this.user = this.utilsService.getLocalStorage('user');
    if (this.employee) this.form.setValue(this.employee);
  }
}
