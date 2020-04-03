import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { map } from 'rxjs/operators';
import { Usuario } from '../models/usuario.model';
import { AngularFirestore } from '@angular/fire/firestore';

import 'firebase/firestore';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    public auth: AngularFireAuth,
    public firestore: AngularFirestore
  ) { }

  initAuthListener() {
    this.auth.authState.subscribe( fuser => {
      console.log('fuser', fuser);
    });
  }

  crearUsuario(
    nombre: string,
    email: string,
    password: string) {

    return this.auth.createUserWithEmailAndPassword(email, password)
      .then( ({ user }) => {
        const newUser = new Usuario(
          user.uid,
          nombre,
          user.email
        );

        return this.firestore.doc(`${ user.uid }/usuario`)
          .set({ ...newUser })
          .then( () => {
            console.log('success');
          });

      }).catch( err => {

      });
  }

  logearUsuario(correo, password) {
    return this.auth.signInWithEmailAndPassword(correo, password);
  }

  logoutUsuario() {
    return this.auth.signOut();
  }

  isLogged() {
    return this.auth.authState.pipe(
      map( fUser => fUser !== null )
    );
  }
}