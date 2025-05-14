import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';

import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonIcon,
  IonInput,
  IonText,
  IonLabel,
  IonItem,
  IonCol,
  IonRow,
  IonGrid,
  IonFabButton,
  IonFabList,
  IonFab,
  ToastController,
} from '@ionic/angular/standalone';

import { Flashlight } from '@awesome-cordova-plugins/flashlight/ngx';
import { Vibration } from '@awesome-cordova-plugins/vibration/ngx';
import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';
import {
  DeviceMotion,
  DeviceMotionAccelerationData,
} from '@awesome-cordova-plugins/device-motion/ngx';

import { AuthService } from 'src/app/services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    IonGrid,
    IonRow,
    IonCol,
    IonItem,
    IonText,
    IonInput,
    IonButton,
    IonContent,
    NgIf,
    FormsModule,
  ],
  providers: [Flashlight, Vibration, ScreenOrientation, DeviceMotion],
})
export class HomePage {
  // Inyecciones
  private authService = inject(AuthService);
  private router = inject(Router);
  private flashlight = inject(Flashlight);
  private vibration = inject(Vibration);
  private screenOrientation = inject(ScreenOrientation);
  private deviceMotion = inject(DeviceMotion);
  private toast = inject(ToastController);

  // Estado
  pressedButton = false;
  alarmActivated = false;
  password!: string;
  accelerationX: any;
  accelerationY: any;
  accelerationZ: any;
  subscription: any;

  audioLeft = '../../../assets/sonidos/audioIzquierda.mp3';
  audioRight = '../../../assets/sonidos/audioDerecha.mp3';
  audioVertical = '../../../assets/sonidos/audioVertical.mp3';
  audioHorizontal = '../../../assets/sonidos/audioHorizontal.mp3';
  audio = new Audio();

  firstAdmission = true;
  firstAdmissionFlash = true;
  currentPositionCellPhone = 'actual';
  previousPositionCellPhone = 'anterior';

  cerrarSesion() {
    if (this.authService.currentUser()) {
      console.log(this.authService.currentUser()?.username);
      this.authService.logout();
      this.router.navigateByUrl('/login');
    }
  }

  accionPrincipal() {
    console.log('Botón grande presionado');
  }

  activateAlarm() {
    this.pressedButton = true;
    setTimeout(() => {
      this.alarmActivated = true;
      this.AlertSuccess('Alarma activada').then((alert) => {
        alert.present();
        this.start();
      });
      this.pressedButton = false;
    }, 2000);
  }

  desactivateAlarm() {
    if (this.password === '111111') {
      this.pressedButton = true;
      setTimeout(() => {
        this.alarmActivated = false;
        this.AlertSuccess('Alarma desactivada').then((alert) => {
          this.subscription?.unsubscribe();
          alert.present();
          this.firstAdmission = true;
          this.audio.pause();
        });
        this.pressedButton = false;
        this.password = '';
      }, 2000);
    } else {
      this.Alert('Contraseña incorrecta').then((alert) => {
        alert.present();
        this.moveVertical();
        this.moveHorizontal();
      });
    }
  }

  start() {
    this.subscription = this.deviceMotion
      .watchAcceleration({ frequency: 300 })
      .subscribe((acceleration: DeviceMotionAccelerationData) => {
        this.accelerationX = Math.floor(acceleration.x);
        this.accelerationY = Math.floor(acceleration.y);
        this.accelerationZ = Math.floor(acceleration.z);

        if (acceleration.x > 5) {
          this.currentPositionCellPhone = 'izquierda';
          this.moveLeft();
        } else if (acceleration.x < -5) {
          this.currentPositionCellPhone = 'derecha';
          this.moveRight();
        } else if (acceleration.y >= 9) {
          this.currentPositionCellPhone = 'arriba';

          if (
            this.currentPositionCellPhone !== this.previousPositionCellPhone
          ) {
            this.audio.src = this.audioVertical;
            this.previousPositionCellPhone = 'arriba';
          }
          this.audio.play();
          this.moveVertical();
        } else if (
          acceleration.z >= 9 &&
          acceleration.y >= -1 &&
          acceleration.y <= 1 &&
          acceleration.x >= -1 &&
          acceleration.x <= 1
        ) {
          this.currentPositionCellPhone = 'plano';
          this.moveHorizontal();
        }
      });
  }

  moveLeft() {
    this.firstAdmission = false;
    this.firstAdmissionFlash = true;
    if (this.currentPositionCellPhone !== this.previousPositionCellPhone) {
      this.previousPositionCellPhone = 'izquierda';
      this.audio.src = this.audioLeft;
    }
    this.audio.play();
  }

  moveRight() {
    this.firstAdmission = false;
    this.firstAdmissionFlash = true;
    if (this.currentPositionCellPhone !== this.previousPositionCellPhone) {
      this.previousPositionCellPhone = 'derecha';
      this.audio.src = this.audioRight;
    }
    this.audio.play();
  }

  moveVertical() {
    if (this.firstAdmissionFlash) {
      this.firstAdmissionFlash && this.flashlight.switchOn();
      setTimeout(() => {
        this.firstAdmissionFlash = false;
        this.flashlight.switchOff();
      }, 5000);
      this.firstAdmission = false;
    }
  }

  moveHorizontal() {
    if (this.currentPositionCellPhone !== this.previousPositionCellPhone) {
      this.previousPositionCellPhone = 'plano';
      this.audio.src = this.audioHorizontal;
    }

    if (!this.firstAdmission) {
      this.audio.play();
      this.vibration.vibrate(5000);
    }

    this.firstAdmission = true;
    this.firstAdmissionFlash = true;
  }

  Alert(message: string) {
    return this.toast.create({
      message,
      position: 'bottom',
      color: 'danger',
      duration: 2000,
    });
  }

  AlertSuccess(message: string) {
    return this.toast.create({
      message,
      position: 'bottom',
      color: 'success',
      duration: 2000,
    });
  }
}
