import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
import { getDatabase, ref, push, set, query, orderByChild, limitToLast, get } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-database.js";
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

window.addEventListener('DOMContentLoaded', (event) => {
    onAuthStateChanged(auth, user => {
        if (!user) {
            window.location.href = 'login.html';
        } else {
            const addDateForm = document.getElementById('addDateForm');
            if (addDateForm) {
                addDateForm.addEventListener('submit', async (e) => {
                    e.preventDefault();

                    const dateName = document.getElementById('dateName').value;
                    const date = document.getElementById('date').value;

                    const userId = user.uid;
                    const newDateRef = push(ref(db, `users/${userId}/dates`));

                    await set(newDateRef, {
                        name: dateName,
                        date: date
                    });

                    alert('Date ajoutée avec succès');
                    document.getElementById('dateName').value = '';
                    document.getElementById('date').value = '';
                    fetchRecentDates(userId);
                });
            }
            fetchRecentDates(user.uid);
        }
    });
});

// Fonction pour récupérer et afficher les 5 dates les plus récentes
function fetchRecentDates(userId) {
    const datesRef = ref(db, `users/${userId}/dates`);
    const recentDatesQuery = query(datesRef, orderByChild('date'), limitToLast(5));

    get(recentDatesQuery).then(snapshot => {
        if (snapshot.exists()) {
            const dates = [];
            snapshot.forEach(dateSnap => {
                dates.push({ id: dateSnap.key, ...dateSnap.val() });
            });
            dates.reverse(); // Trier dans l'ordre décroissant des dates
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
        style="display:flex;flex-direction:column; border: solid #D2B48C; font-size: 1.2rem;
        width: 100%; border-radius: 0.6rem; margin-bottom: 1rem; padding: 0.3rem; text-decoration: none;
        color: inherit;">
          <p style=" margin: 0;text-align:start;">${new Date(date.date).toLocaleDateString()}</p>
            <p style=" margin: 0; text-align:end;">${date.name}</p>
          
        </a>
        `;
        dateList.appendChild(li);
    });
}
