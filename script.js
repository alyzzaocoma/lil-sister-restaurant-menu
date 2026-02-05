document.addEventListener("DOMContentLoaded", () => {
const menuGrid = document.getElementById("menuGrid");
const template = document.getElementById("menuCardTemplate");

let totalItems = 0;
let totalPrice = 0;

function updateCartTab() {
document.getElementById("cart-quantity").textContent = totalItems;
document.getElementById("cart-total").textContent = "₱" + totalPrice;
}

//MENU ITEMS (ADD HERE)
const menuItems = [
{
name: "Pancit",
description: "Classic Filipino noodle dish.",
price: 120,
image: "images/pancit.jpg"
},
{
name: "Ham & Egg Sandwhich",
description: "One sliced bread with whole piece of ham on top with 3 sliced eggs.",
price: 180,
image: "images/ham-egg.jpg"
},
{
name: "Coffee",
description: "Iced Americano on a regular size.",
price: 210,
image: "images/coffee.jpg"
},
{
name: "American Sandwhich",
description: "Typical layered American sandwhich with tomato, cheese, lettuce, and a patty.",
price: 160,
image: "images/sandwhich.jpg"
},
];

menuItems.forEach(item => {
const card = template.content.cloneNode(true);
const cardElement = card.querySelector(".menu-card");

//FILL CARD CONTENT
card.querySelector(".menu-image").src = item.image;
card.querySelector(".menu-image").alt = item.name;
card.querySelector(".menu-name").textContent = item.name;
card.querySelector(".price").textContent = "₱" + item.price;
card.querySelector(".menu-description").textContent = item.description;

// Flip on click (ignore buttons)
cardElement.addEventListener("click", (e) => {
if (e.target.tagName.toLowerCase() === "button") return;
cardElement.classList.toggle("flipped");
});

//QUANTITY BUTTONS
const addBtn = card.querySelector(".add-btn");
const quantityControls = card.querySelector(".quantity-controls");
const cancelBtn = card.querySelector(".cancel-btn");
const quantitySpan = card.querySelector(".quantity");
const increaseBtn = card.querySelector(".increase-btn");
const decreaseBtn = card.querySelector(".decrease-btn");

//ADD
addBtn.addEventListener("click", () => {
addBtn.classList.add("hidden");
quantityControls.classList.remove("hidden");

totalItems += 1;
totalPrice += item.price;
updateCartTab();
});

//INCREASE
increaseBtn.addEventListener("click", () => {
let qty = parseInt(quantitySpan.textContent);
qty++;
quantitySpan.textContent = qty;

totalItems += 1;
totalPrice += item.price;
updateCartTab();
});

//DECREASE
decreaseBtn.addEventListener("click", () => {
let qty = parseInt(quantitySpan.textContent);
if (qty > 1) {
qty--;
quantitySpan.textContent = qty;

totalItems -= 1;
totalPrice -= item.price;
updateCartTab();
}
});

//CANCEL OR REMOVE
cancelBtn.addEventListener("click", () => {
const qty = parseInt(quantitySpan.textContent);

totalItems -= qty;
totalPrice -= qty * item.price;
updateCartTab();

//RESET UI
quantitySpan.textContent = 1;
quantityControls.classList.add("hidden");
addBtn.classList.remove("hidden");
});

menuGrid.appendChild(card);
});
});

//RECEIPT POP-UP WINDOW
const doneBtn = document.getElementById("done-btn");
const popup = document.getElementById("popup");
const closePopup = document.getElementById("close-popup");

doneBtn.addEventListener("click", () => {
popup.classList.remove("hidden");
});

closePopup.addEventListener("click", () => {
popup.classList.add("hidden");
});