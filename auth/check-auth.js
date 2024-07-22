import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js";

// Configuration Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDaSbGFxMmN4GRwaqrRHmzHlG3Bs7-7Rkc",
  authDomain: "gestion-de-course-js.firebaseapp.com",
  databaseURL: "https://gestion-de-course-js-default-rtdb.firebaseio.com",
  projectId: "gestion-de-course-js",
  storageBucket: "gestion-de-course-js.appspot.com",
  messagingSenderId: "291819814986",
  appId: "1:291819814986:web:9edcb2f2e5c613dff6a6b3"
};

// Initialisation de Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const checkAuth = () => {
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      // Redirection vers la page de connexion si l'utilisateur n'est pas connecté
      window.location.href = '/auth/login.html';
    }
  });
};

