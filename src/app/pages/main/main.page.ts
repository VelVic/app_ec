import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {

  router = inject(Router);
  firebaseService = inject(FirebaseService);
  utillsService = inject(UtilsService);
  currentPath = '';

  pages = [
    {
      title: 'Clientes',
      url: '/main/registers',
      icon: 'briefcase',
    },
    {
      title: 'Productos',
      url: '/main/inventory',
      icon: 'cube',
    },
    {
      title: 'Herramientas',
      url: '/main/tools',
      icon: 'construct',
    },
    {
      title: 'Servicios',
      url: '/main/costs',
      icon: 'pricetags',
    },
    {
      title: 'Perfil',
      url: '/main/profile',
      icon: 'person',
    },
  ];

  admin = [
    {
      title: 'Reportes',
      url: '/main/report',
      icon: 'documents',
      color:'light'
    },
    {
      title: 'Empleados',
      url: '/main/employees',
      icon: 'people',
      color:'light'
    },
    {
      title: 'Cuentas',
      url: '/main/accounts',
      icon: 'person-add',
      color:'light'
    },
    {
      title: 'Proveedores',
      url: '/main/providers',
      icon: 'library',
      color:'light'
    },
  ];
  constructor() { }

  ngOnInit() {
    this.router.events.subscribe((event: any) => {
      if (event?.url) this.currentPath = event.url
      })
    }

    signOut(){
      this.firebaseService.signOut();
    }

    user(): User{
      return this.utillsService.getLocalStorage('user');
    }
}
