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
    window.location.href = '/auth/login.html';
}

let currentProductId = null; // Variable pour suivre le produit en cours de modification

onAuthStateChanged(auth, user => {
    if (!user) {
        window.location.href = '/login.html';
    } else {
        // Récupérer et afficher les informations de la date
        fetchDate(user.uid, dateId);

        // Ajouter ou mettre à jour un produit
        document.getElementById('addProductForm').addEventListener('submit', async (e) => {
            e.preventDefault();

            const productName = document.getElementById('productName').value;
            const productQuantity = document.getElementById('productQuantity').value;
            const productPrice = document.getElementById('productPrice').value;

            const userId = user.uid;
            const productsRef = ref(db, `users/${userId}/dates/${dateId}/products`);

            if (currentProductId) {
                // Mise à jour d'un produit existant
                const productRef = ref(db, `users/${userId}/dates/${dateId}/products/${currentProductId}`);
                await update(productRef, {
                    name: productName,
                    quantity: parseInt(productQuantity),
                    price: parseFloat(productPrice)
                });
                alert('Produit mis à jour avec succès');
                currentProductId = null; // Réinitialiser currentProductId après la mise à jour
            } else {
                // Ajouter un nouveau produit
                const newProductRef = push(productsRef);
                await set(newProductRef, {
                    name: productName,
                    quantity: parseInt(productQuantity),
                    price: parseFloat(productPrice),
                    status: 'inactive'
                });
                alert('Produit ajouté avec succès');
            }

            resetForm();
            fetchProducts(userId, dateId);
        });

        // Récupérer et afficher les produits
        fetchProducts(user.uid, dateId);

        // Gestion de la sélection du menu déroulant pour les dates
        document.querySelector('.action-buttons').addEventListener('click', (e) => {
            const target = e.target.closest('button');
            if (target) {
                const action = target.id;
                if (action === 'editButton') {
                    document.getElementById('editDateForm').style.display = 'block';
                    document.getElementById('editDateName').value = document.getElementById('dateName').textContent;
                } else if (action === 'deleteButton') {
                    if (confirm('Êtes-vous sûr de vouloir supprimer cette date ?')) {
                        const dateRef = ref(db, `users/${user.uid}/dates/${dateId}`);
                        remove(dateRef).then(() => {
                            alert('Date supprimée avec succès');
                            window.location.href = '/index.html'; // Rediriger vers une autre page après suppression
                        }).catch(error => {
                            console.error("Error deleting date:", error);
                        });
                    }
                }
            }
        });

        // Gestion du formulaire de modification de la date
        document.getElementById('editDateForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const newDateName = document.getElementById('editDateName').value;
            const dateRef = ref(db, `users/${user.uid}/dates/${dateId}`);
            await update(dateRef, { name: newDateName });
            alert('Date mise à jour avec succès');
            document.getElementById('editDateForm').style.display = 'none';
            document.getElementById('dateName').textContent = newDateName;
        });

        // Annuler la modification de la date
        document.getElementById('cancelEditDate').addEventListener('click', () => {
            document.getElementById('editDateForm').style.display = 'none';
        });
    }
});

// Fonction pour récupérer et afficher les informations de la date
function fetchDate(userId, dateId) {
    const dateRef = ref(db, `users/${userId}/dates/${dateId}`);
    get(dateRef).then(snapshot => {
        if (snapshot.exists()) {
            const date = snapshot.val();
            document.getElementById('dateName').textContent = date.name;
            document.getElementById('dateCreated').textContent = new Date(date.date).toLocaleDateString(); // Affiche la date de création
        } else {
            console.log("Date not found");
        }
    }).catch(error => {
        console.error("Error fetching date:", error);
    });
}

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
        li.className = 'd-flex justify-content-between align-items-center list-group-item ticket1';
        const statusIcon = product.status === 'active' 
            ? '<i class="fa-solid fa-square-check text-success" style="font-size:2.4rem; margin-top:-0.5rem;"></i>' 
            : '<i class="fa-solid fa-square-xmark text-danger" style="font-size:2.4rem ; margin-top:-0.5rem;"></i>';
        li.innerHTML = `
            <div class="d-flex justify-content-between "
                style="border: solid #D2B48C; font-size: 1rem; width:100%;
                border-radius: 0.75rem; margin-bottom: 0.5rem; padding: 0.5rem; text-decoration: none;
                color: inherit;">
                <div>
                    <h4>Nbr:</h4>
                    <p style="font-size:1rem;">${product.quantity}</p>
                    <button class="btn  btn-sm me-2 align-items-center" onclick="updateProductStatus('${product.id}', '${product.status}')"> ${statusIcon}  </button> 
                </div>
                <div>
                    <h4>Produits</h4>
                    <p  style="font-size:1rem;">${product.name}</p>
                </div>
                <div>
                    <h4>Prix</h4>
                    <p style="font-size:1rem;">${product.price.toFixed(2)} CFA</p>
                    <div class="d-flex justify-content-end">
                        <button class="btn btn-warning btn-sm me-2" onclick="showEditForm('${product.id}', '${product.name}', ${product.quantity}, ${product.price}, '${product.status}')"> 
                            <i class="fa-solid fa-pen-to-square" style="font-size:1.3rem"></i>   
                        </button>
                        <button class="btn btn-danger btn-sm" onclick="deleteProduct('${product.id}')"> 
                            <i class="fa-solid fa-trash-can" style="font-size:1.3rem"></i>  
                        </button>
                    </div>
                </div>
            </div>
        `;
        productList.appendChild(li);
    });
}

// Fonction pour afficher le formulaire de modification
window.showEditForm = function(productId, name, quantity, price, status) {
    document.getElementById('productName').value = name;
    document.getElementById('productQuantity').value = quantity;
    document.getElementById('productPrice').value = price;
    currentProductId = productId; // Définir currentProductId pour la mise à jour
};

// Fonction pour réinitialiser le formulaire
function resetForm() {
    document.getElementById('productName').value = '';
    document.getElementById('productQuantity').value = '';
    document.getElementById('productPrice').value = '';
    currentProductId = null; // Réinitialiser currentProductId
}

// Fonction pour mettre à jour le statut d'un produit
window.updateProductStatus = function(productId, currentStatus) {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    const productRef = ref(db, `users/${auth.currentUser.uid}/dates/${dateId}/products/${productId}`);
    update(productRef, { status: newStatus })
        .then(() => {
            alert('Statut du produit mis à jour');
            fetchProducts(auth.currentUser.uid, dateId);
        })
        .catch(error => {
            console.error("Error updating product status:", error);
        });
};

// Fonction pour supprimer un produit
window.deleteProduct = function(productId) {
    const productRef = ref(db, `users/${auth.currentUser.uid}/dates/${dateId}/products/${productId}`);
    remove(productRef)
        .then(() => {
            alert('Produit supprimé avec succès');
            fetchProducts(auth.currentUser.uid, dateId);
        })
        .catch(error => {
            console.error("Error deleting product:", error);
        });
};
