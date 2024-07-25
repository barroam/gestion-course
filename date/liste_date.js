import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
import { getDatabase, ref, query, get } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-database.js";
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
const db = getDatabase(app);
const auth = getAuth(app);

// Vérification de l'état d'authentification
onAuthStateChanged(auth, user => {
    if (!user) {
        window.location.href = '/auth/login.html';
    } else {
        fetchAllDates(user.uid);
    }
});

// Fonction pour récupérer toutes les dates
function fetchAllDates(userId) {
    const datesRef = ref(db, `users/${userId}/dates`);
    const allDatesQuery = query(datesRef);

    get(allDatesQuery).then(snapshot => {
        if (snapshot.exists()) {
            const dates = [];
            snapshot.forEach(dateSnap => {
                dates.push({ id: dateSnap.key, ...dateSnap.val() });
            });
            displayDates(dates);
        } else {
            console.log("No data available");
        }
    }).catch(error => {
        console.error("Error fetching data:", error);
    });
}

// Fonction pour afficher les dates
function displayDates(dates) {
    const dateList = document.getElementById('dateList');
    dateList.innerHTML = ''; // Clear the list
    dates.forEach(date => {
        const li = document.createElement('li');
        li.className = 'list-group-item';
        li.innerHTML = `
           <a href="details_date.html?dateId=${date.id}" class="custom-link"
            style="display:flex;justify-content:space-between; border: solid #D2B48C; font-size: 1.2rem;
            width: 100%; border-radius: 0.6rem; margin-bottom: 1rem; padding: 0.3rem; text-decoration: none;
            color: inherit;">
                <p style="margin: 0; text-align:start;">${new Date(date.date).toLocaleDateString()}</p>
                <p style="margin: 0; text-align:end;">${date.name}</p>
            </a>
        `;
        dateList.appendChild(li);
    });
}
