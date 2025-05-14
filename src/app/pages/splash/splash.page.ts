import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule],
})
export class SplashPage implements OnInit {
  router = inject(Router);

  constructor() {
    setTimeout(() => {
      this.router.navigateByUrl('/login');
    }, 2000);
  }

  ngOnInit() {}
}
