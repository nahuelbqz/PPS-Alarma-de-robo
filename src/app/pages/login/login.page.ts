import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  IonInput,
  IonLabel,
  IonItem,
  IonButton,
  IonIcon,
  IonContent,
  IonCol,
  IonGrid,
  IonRow,
} from '@ionic/angular/standalone';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    IonInput,
    IonButton,
    IonContent,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgIf,
  ],
})
export class LoginPage implements OnInit {
  fb = inject(FormBuilder);
  router = inject(Router);

  authService = inject(AuthService);
  hidePassword = true;

  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });
  errorMessage: string | null = null;

  ngOnInit() {}

  onSubmit() {
    const rawForm = this.form.getRawValue();

    this.authService
      .login(rawForm.email, rawForm.password)
      .subscribe((result) => {
        if (result.error) {
          this.errorMessage = result.error.message;

          Swal.fire({
            icon: 'error',
            text: 'Email y/o contraseña incorrectos',
            showConfirmButton: false,
            timer: 2000,
            heightAuto: false,
          });
        } else {
          console.log('Login exitoso');
          this.router.navigateByUrl('/home');
        }
      });
  }

  autocompletarUsuario(tipo: string) {
    let usuario = { email: '', password: '' };

    // {"id":1, "correo":"admin@admin.com", "clave":111111, "perfil":"admin", "sexo":"femenino"}
    // {"id":2, "correo":"invitado@invitado.com", "clave":222222, "perfil":"invitado", "sexo":"femenino"}
    // {"id":3, "correo":"usuario@usuario.com", "clave":333333, "perfil":"usuario", "sexo":"masculino"}
    // {"id":4, "correo":"anonimo@anonimo.com", "clave":444444, "perfil":"usuario", "sexo":"masculino"}
    // {"id":5, "correo":"tester@tester.com", "clave":555555, "perfil":"tester","sexo": "femenino"}

    switch (tipo) {
      case 'A':
        usuario = {
          email: 'admin@admin.com',
          password: '111111',
        };
        break;
      case 'B':
        usuario = {
          email: 'invitado@invitado.com',
          password: '222222',
        };
        break;
      case 'C':
        usuario = {
          email: 'usuario@usuario.com',
          password: '333333',
        };
        break;
      case 'D':
        usuario = {
          email: 'anonimo@anonimo.com',
          password: '444444',
        };
        break;
      case 'E':
        usuario = {
          email: 'tester@tester.com',
          password: '555555',
        };
        break;
    }

    this.form.controls['email'].setValue(usuario.email);
    this.form.controls['password'].setValue(usuario.password);

    console.log(this.form.value);
  }
}
