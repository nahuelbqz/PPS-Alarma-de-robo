import { Injectable, signal } from '@angular/core';
import { AuthResponse, createClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  currentUser = signal<{ email: string; username: string } | null>(null);

  async isLoggedIn(): Promise<boolean> {
    const { data, error } = await this.supabase.auth.getSession();
    return !!data.session;
  }

  register(
    username: string,
    email: string,
    password: string
  ): Observable<AuthResponse> {
    const promise = this.supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
        },
      },
    });

    return from(promise);
  }

  login(email: string, password: string): Observable<AuthResponse> {
    const promise = this.supabase.auth.signInWithPassword({
      email,
      password,
    });

    return from(promise);
  }

  logout(): void {
    this.supabase.auth.signOut();
    console.log('Logout exitoso');
  }
}
