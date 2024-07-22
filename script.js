const button1 = document.getElementById('ajouterliste');
const button2 = document.getElementById('voirliste');

// Add event listeners to the buttons
button1.addEventListener('click', () => {
    // Redirect to the first page
    window.location.href = '/date/date.html';
});

button2.addEventListener('click', () => {
    // Redirect to the second page
    window.location.href = '/date/liste_date.html';
});