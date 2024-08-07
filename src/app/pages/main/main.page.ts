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
      title: 'Perfil',
      url: '/main/profile',
      icon: 'person-outline',
      color:'dark'
    },
    {
      title: 'Empleados',
      url: '/main/home',
      icon: 'home-outline',
      color:'dark'
    },
    {
      title: 'Registros',
      url: '/main/registers',
      icon: 'clipboard-outline',
      color:'dark'
    },
    {
      title: 'Inventario',
      url: '/main/registers',
      icon: 'albums-outline',
      color:'dark'
    },
    {
      title: 'Herramientas',
      url: '/main/registers',
      icon: 'hammer-outline',
      color:'dark'
    },
    {
      title: 'Gastos',
      url: '/main/registers',
      icon: 'cash-outline',
      color:'dark'
    }
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
      return this.utillsService.geLocalStorage('user');
    }
}
