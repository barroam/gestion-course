import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js";

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

// Gestion de la connexion des utilisateurs
const LoginForm = document.getElementById('LoginForm');
LoginForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    alert('Connexion réussie !');
    // Redirection ou autre action après connexion réussie
    window.location.href = "/index.html"; // Par exemple, rediriger vers une page tableau de bord
  } catch (error) {
  /*  alert('Erreur lors de la connexion : ' + error.message);
    console.error('Code de l\'erreur :', error.code);
    console.error('Message de l\'erreur :', error.message); */
  }
});
