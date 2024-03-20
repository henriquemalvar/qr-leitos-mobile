import AsyncStorage from "@react-native-async-storage/async-storage";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import { Environment } from "./environment.class";

class FirebaseDatabase {
  constructor() {
    const env = new Environment("qr-leitos-piloto");
    const config = env.getEnvironmentConfig("firebase");
    const firebaseConfig = {
      apiKey: config.apiKey,
      authDomain: config.authDomain,
      projectId: config.projectId,
      storageBucket: config.storageBucket,
      messagingSenderId: config.messagingSenderId,
      appId: config.appId,
    };

    if (firebase.apps.length === 0) {
      const app = firebase.initializeApp(firebaseConfig);
      initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage),
      });
    }
    this.db = firebase.firestore();
  }
}

const database = new FirebaseDatabase();

export default database.db;
