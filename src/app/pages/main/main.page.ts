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
      title: 'Registros',
      url: '/main/registers',
      icon: 'clipboard-outline',
      color:'light'
    },
    {
      title: 'Inventario',
      url: '/main/inventory',
      icon: 'albums-outline',
      color:'light'
    },
    {
      title: 'Herramientas',
      url: '/main/tools',
      icon: 'hammer-outline',
      color:'light'
    },
    {
      title: 'Costos',
      url: '/main/costs',
      icon: 'wallet-outline',
      color:'light'
    },
    {
      title: 'Perfil',
      url: '/main/profile',
      icon: 'id-card-outline',
      color:'light'
    },
  ];

  admin = [
    {
      title: 'Finanzas',
      url: '/main/finance',
      icon: 'cash-outline',
      color:'light'
    },
    {
      title: 'Empleados',
      url: '/main/home',
      icon: 'people-outline',
      color:'light'
    },
    {
      title: 'Crear Cuenta',
      url: '/main/create-account',
      icon: 'person-add-outline',
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
