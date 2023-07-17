import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBHUp05s6jdh1xIML92IGhhEF44QsFiPFU",
  authDomain: "qr-leitos-dev",
  projectId: "qr-leitos-dev",
  storageBucket: "bdleitosja.appspot.com",
  messagingSenderId: "818105979304",
  appId: "1:856419808971:web:8334f49864938daefe8d4e",
};

let app;

if (firebase.apps.length === 0) {
  app = firebase.initializeApp(firebaseConfig);
} else {
  app = firebase.app();
}

const db = app.firestore();

export default db;
