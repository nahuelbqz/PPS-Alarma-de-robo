import { Component, inject, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { AuthService } from './services/auth.service';

import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent implements OnInit {
  authService = inject(AuthService);

  router = inject(Router);

  constructor() {}

  ngOnInit(): void {
    this.authService.supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        this.authService.currentUser.set({
          email: session?.user?.email!,
          username:
            session?.user.identities?.at(0)?.identity_data?.['username'],
        });
      } else if (event === 'SIGNED_OUT') {
        this.authService.currentUser.set(null);
      }

      console.log('Auth state changed:', event, session);
    });
    this.router.navigateByUrl('/splash');
  }

  logout(): void {
    this.authService.logout();
    console.log('Logout exitoso');
  }
}
