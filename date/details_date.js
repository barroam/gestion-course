import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
import { getDatabase, ref, push, set, update, remove, get, query, orderByChild } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-database.js";
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

// Récupérer les paramètres de l'URL
const urlParams = new URLSearchParams(window.location.search);
const dateId = urlParams.get('dateId');

if (!dateId) {
    alert('Date ID is missing');
    window.location.href = 'index.html';
}

onAuthStateChanged(auth, user => {
    if (!user) {
        window.location.href = '/login.html';
    } else {
        // Ajouter un produit
        document.getElementById('addProductForm').addEventListener('submit', async (e) => {
            e.preventDefault();

            const productName = document.getElementById('productName').value;
            const productQuantity = document.getElementById('productQuantity').value;
            const productPrice = document.getElementById('productPrice').value;

            const userId = user.uid;
            const productsRef = ref(db, `users/${userId}/dates/${dateId}/products`);
            const newProductRef = push(productsRef);

            await set(newProductRef, {
                name: productName,
                quantity: parseInt(productQuantity),
                price: parseFloat(productPrice),
                status: 'active'
            });

            alert('Produit ajouté avec succès');
            document.getElementById('productName').value = '';
            document.getElementById('productQuantity').value = '';
            document.getElementById('productPrice').value = '';
            fetchProducts(userId, dateId);
        });

        // Récupérer et afficher les produits
        fetchProducts(user.uid, dateId);
    }
});

// Fonction pour récupérer et afficher les produits
function fetchProducts(userId, dateId) {
    const productsRef = ref(db, `users/${userId}/dates/${dateId}/products`);
    const productsQuery = query(productsRef, orderByChild('name'));

    get(productsQuery).then(snapshot => {
        if (snapshot.exists()) {
            const products = [];
            snapshot.forEach(productSnap => {
                products.push({ id: productSnap.key, ...productSnap.val() });
            });
            displayProducts(products);
        } else {
            console.log("No products available");
        }
    }).catch(error => {
        console.error("Error fetching products:", error);
    });
}

// Fonction pour afficher les produits
function displayProducts(products) {
    const productList = document.getElementById('productList');
    productList.innerHTML = ''; // Clear the list

    products.forEach(product => {
        const li = document.createElement('li');
        li.className = 'd-flex justify-content-between align-items-center';
        const statusIcon = product.status === 'active' 
        ? '<i class="fa-solid fa-square-check text-success"style="font-size:2rem"></i>' 
        : '<i class="fa-solid fa-square-xmark text-danger" style="font-size:2rem"></i>';
        li.innerHTML = `
       
            <div class="d-flex justify-content-between"
        style=" border: solid #D2B48C; font-size: 1.rem;width:100%;
        border-radius: 0.75rem; margin-bottom: 0.5rem; padding: 0.5rem; text-decoration: none;
        color: inherit; ">
         <div>
            <h4>Nbr:</h4>
            <p>${product.quantity}</p>
           ${statusIcon}
         </div>
         <div><h4>Produits</h4>
          <p>${product.name}</p></div>
         <div> <h4>Prix</h4>
        <p>${product.price.toFixed(2)} CFA</p>
        <div class ="d-flex justify-content-end">
        <button class="btn btn-warning btn-sm me-2" onclick="showEditForm('${product.id}', '${product.name}', ${product.quantity}, ${product.price}, '${product.status}')"> <i class="fa-solid fa-pen-to-square"></i>   </button>
        <button class="btn btn-danger btn-sm" onclick="deleteProduct('${product.id}')"> <i class="fa-solid fa-trash-can"></i>  </button>

        </div>
        </div>
          
       </div>
        `;
        productList.appendChild(li);
    });
}
