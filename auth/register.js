// Importation des modules Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js";

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
const db = getDatabase(app); // Obtenir l'instance de la base de données

// Gestion de l'inscription des utilisateurs
const MainForm = document.getElementById('MainForm');
MainForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const email = document.getElementById('emailInp').value;
  const password = document.getElementById('passwordInp').value;
  const firstName = document.getElementById('fnameInp').value;
  const lastName = document.getElementById('lnameInp').value;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await set(ref(db, 'users/' + user.uid), {
      firstName: firstName,
      lastName: lastName,
      email: email
    });
    window.location.href = "/index.html";
    alert('Inscription réussie !');
  } catch (error) {
    alert('Erreur lors de l\'inscription : ' + error.message);
    console.error('Code de l\'erreur :', error.code);
    console.error('Message de l\'erreur :', error.message);
  }
});
