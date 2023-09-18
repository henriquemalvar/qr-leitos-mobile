import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import { Environment } from "./environment.class";

class Database {
  constructor() {
    const env = new Environment("qr-leitos-dev");
    const config = env.getConfig("firebase");
    const firebaseConfig = {
      apiKey: config.apiKey,
      authDomain: config.authDomain,
      projectId: config.projectId,
      storageBucket: config.storageBucket,
      messagingSenderId: config.messagingSenderId,
      appId: config.appId,
    };

    if (firebase.apps.length === 0) {
      firebase.initializeApp(firebaseConfig);
    }
    this.db = firebase.firestore();
  }
}

const database = new Database();

export default database.db;
