document.addEventListener("DOMContentLoaded", () => {
const menuGrid = document.getElementById("menuGrid");
const template = document.getElementById("menuCardTemplate");

let totalItems = 0;
let totalPrice = 0;

menuGrid.addEventListener("click", (e) => {
const card = e.target.closest(".menu-card");
if (!card) return;
if (e.target.tagName.toLowerCase() === "button" || e.target.closest(".quantity-controls")) {
return;
}

if (card.classList.contains("flipped")) {
card.classList.remove("flipped");
} else {
document.querySelectorAll(".menu-card.flipped").forEach(c => {
c.classList.remove("flipped");
});

card.classList.add("flipped");
}
});


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

// RECEIPT POP-UP WINDOW
const namePopup = document.getElementById("name-popup");
const closeNamePopup = document.getElementById("close-name-popup");
const submitNameBtn = document.getElementById("submit-name");
const customerNameInput = document.getElementById("customer-name-input");
const popup = document.getElementById("popup");
const closePopup = document.getElementById("close-popup");
const closeBtn = document.getElementById("close-btn");
const receiptDetails = document.getElementById("receipt-details");
const processingText = document.getElementById("processing-text");
const doneBtn = document.getElementById("done-btn");

doneBtn.addEventListener("click", () => {
if (totalItems === 0) {
alert("Please select at least one item before proceeding.");
return;
}
namePopup.classList.remove("hidden");
customerNameInput.focus();
});

closeNamePopup.addEventListener("click", () => {
namePopup.classList.add("hidden");
});

submitNameBtn.addEventListener("click", () => {
const customerName = customerNameInput.value.trim();
if (!customerName || customerName.trim() === "") {
alert("Please enter your name.");
return;
}

//RECEIPT DETAILS
let receiptHTML = "<table>";
    receiptHTML += `<tr>
        <th>QTY</th>
        <th>ITEM</th>
        <th>PRICE</th>
    </tr>`;

    document.querySelectorAll(".menu-card").forEach(card => {
    const name = card.querySelector(".menu-name").textContent;
    const priceText = card.querySelector(".price").textContent.replace("₱","");
    const price = parseInt(priceText);
    const qty = parseInt(card.querySelector(".quantity").textContent);

    if (!card.querySelector(".add-btn").classList.contains("hidden")) return;
    if (qty > 0) {
    receiptHTML += `<tr>
        <td>${qty}</td>
        <td>${name}</td>
        <td>₱${qty*price}</td>
    </tr>`;
    }
    });

    receiptHTML += "</table>";
receiptHTML += `<strong>Total: ₱${totalPrice}</strong>`;
receiptDetails.innerHTML = receiptHTML;

document.getElementById("receipt-name").textContent = customerName;
document.getElementById("receipt-date").textContent = new Date().toLocaleString();
processingText.textContent = "Your order is now being processed.";

//SEND DATA TO GOOGLE SHEETS
const orderData = {
name: customerName,
date: new Date().toLocaleString(),
orders: [],
total: totalPrice
};

// Collect each item from the receipt
document.querySelectorAll("#receipt-details tr").forEach((row, index) => {
if (index === 0) return; // skip header
const cells = row.querySelectorAll("td");
if (cells.length === 3) {
orderData.orders.push({
quantity: cells[0].textContent,
item: cells[1].textContent,
price: cells[2].textContent.replace("₱","")
});
}
});

// Send to Google Sheets
fetch("https://script.google.com/macros/s/AKfycbwZGwSQacLnqY3WfR8k5ZV_mXLE1ogv6LNekMvbilD9UGL0OSjw-0HtXdTbQB-iqvOf/exec",
{
method: "POST",
body: JSON.stringify(orderData)
})
.then(res => res.text())
.then(text => console.log("Submitted:", text))
.catch(err => console.error("Error:", err));

//HIDE NAME POP-UP & SHOW RECEIPT POP-UP WINDOW
namePopup.classList.add("hidden");
popup.classList.remove("hidden");
});

function resetOrder() {
totalItems = 0;
totalPrice = 0;
updateCartTab();

document.querySelectorAll(".menu-card").forEach(card => {
const addBtn = card.querySelector(".add-btn");
const quantityControls = card.querySelector(".quantity-controls");
const quantitySpan = card.querySelector(".quantity");

addBtn.classList.remove("hidden");
quantityControls.classList.add("hidden");
quantitySpan.textContent = 1;
});
}

closePopup.addEventListener("click", () => {
popup.classList.add("hidden");
resetOrder();
});

closeBtn.addEventListener("click", () => {
popup.classList.add("hidden");
resetOrder();
});
});