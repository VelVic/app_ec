import { Component, inject, OnInit } from '@angular/core';
import { Employees } from 'src/app/models/employees.model';
import { UtilsService } from 'src/app/services/utils.service';
import { UpdateEmployeeComponent } from 'src/app/shared/components/update-employee/update-employee.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  UtilsService = inject(UtilsService);
  constructor() { }

  ngOnInit() {
  }

  async addUpdateEmployee(employee?: Employees){
    let modal = await this.UtilsService.getModal({
      component: UpdateEmployeeComponent,
      cssClass: 'app-update-employee',
      componentProps: {employee}
    })
  }

}
