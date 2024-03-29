import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Strategy, ExtractJwt } from 'passport-firebase-jwt';
import * as firebase from 'firebase-admin';
import { readFileSync } from 'fs';

const firebasePath = process.env.FIREBASE_CONFIG_PATH ?? './firebase.config.json';
const firebaseParams = JSON.parse(readFileSync(firebasePath, 'utf8'));

@Injectable()
export class FirebaseAuthStrategy extends PassportStrategy(Strategy, 'firebase-auth') {
  private readonly defaultApp: any;
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
    if (process.env.NODE_ENV !== 'test') {
      this.defaultApp = firebase.initializeApp({
        credential: firebase.credential.cert(firebaseParams),
      });
    }
  }

  async validate(token: string) {
    const firebaseUser: any = await this.defaultApp
      .auth()
      .verifyIdToken(token, true)
      .catch((err) => {
        console.log(err);
        throw new UnauthorizedException(err.message);
      });
    if (!firebaseUser) {
      throw new UnauthorizedException();
    }
    return firebaseUser;
  }
}
