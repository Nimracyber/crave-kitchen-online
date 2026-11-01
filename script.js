// WhatsApp Configuration (Replace with your actual contact number)
const WHATSAPP_NUMBER = "923000000000"; 

// Menu Items Database
const menuItems = [
  {
    id: 1,
    name: "Special Chicken Biryani",
    category: "desi",
    price: 350,
    tag: "Bestseller",
    desc: "Aromatic long-grain basmati rice cooked with spicy succulent chicken & house spices.",
    img: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop"
  },
  {
    id: 2,
    name: "Degi Mutton Korma",
    category: "desi",
    price: 750,
    tag: "Traditional",
    desc: "Rich, slow-cooked gravy made with yoghurt, caramelized onions, and tender mutton.",
    img: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&auto=format&fit=crop"
  },
  {
    id: 3,
    name: "Chicken Tikka Supreme Pizza",
    category: "fastfood",
    price: 990,
    tag: "Hot & Spicy",
    desc: "Hand-tossed crust topped with spiced chicken tikka, mozzarella, peppers, and garlic sauce.",
    img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop"
  },
  {
    id: 4,
    name: "Crispy Zinger Burger",
    category: "fastfood",
    price: 420,
    tag: "Popular",
    desc: "Deep-fried spicy chicken fillet, fresh lettuce, melted cheese, and signature secret mayo.",
    img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop"
  },
  {
    id: 5,
    name: "Seasoned Curly Fries",
    category: "fries",
    price: 280,
    tag: "Crispy",
    desc: "Golden spiral-cut potatoes tossed in paprika, garlic, and peri-peri seasoning.",
    img: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&auto=format&fit=crop"
  },
  {
    id: 6,
    name: "Loaded Mayo Garlic Fries",
    category: "fries",
    price: 320,
    tag: "Cheesy",
    desc: "Crispy straight-cut French fries smothered in garlic mayo, jalapenos, and melted cheese.",
    img: "https://images.unsplash.com/photo-1585109649139-366815a0d713?w=500&auto=format&fit=crop"
  },
  {
    id: 7,
    name: "Mint Margarita",
    category: "drinks",
    price: 180,
    tag: "Chilled",
    desc: "Refreshing icy blend of crushed mint leaves, fresh lime, sprite, and black salt.",
    img: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&auto=format&fit=crop"
  }
];

let cart = [];

// Initialize Menu on Load
document.addEventListener("DOMContentLoaded", () => {
  renderMenu(menuItems);
});

// Render Food Cards
function renderMenu(items) {
  const grid = document.getElementById("menu-grid");
  grid.innerHTML = "";

  if (items.length === 0) {
    grid.innerHTML = `<p style="color: var(--text-muted); grid-column: 1/-1; text-align: center;">No menu items found matching your search.</p>`;
    return;
  }

  items.forEach(item => {
    const card = document.createElement("div");
    card.className = "food-card";
    card.innerHTML = `
      <div class="food-img-wrapper">
        <img src="${item.img}" alt="${item.name}">
        <span class="badge-tag">${item.tag}</span>
      </div>
      <div class="food-details">
        <h3>${item.name}</h3>
        <p>${item.desc}</p>
        <div class="food-bottom">
          <span class="item-price">Rs. ${item.price}</span>
          <button class="add-btn" onclick="addToCart(${item.id})">+ Add</button>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

// Category Filtering
function filterCategory(category, event) {
  document.querySelectorAll(".pill").forEach(btn => btn.classList.remove("active"));
  if (event) event.target.classList.add("active");

  if (category === "all") {
    renderMenu(menuItems);
  } else {
    const filtered = menuItems.filter(item => item.category === category);
    renderMenu(filtered);
  }
}

// Search Filter
function filterMenu() {
  const query = document.getElementById("search-input").value.toLowerCase();
  const filtered = menuItems.filter(item => 
    item.name.toLowerCase().includes(query) || 
    item.desc.toLowerCase().includes(query)
  );
  renderMenu(filtered);
}

// Add Item to Cart
function addToCart(id) {
  const item = menuItems.find(i => i.id === id);
  const existing = cart.find(i => i.id === id);

  if (existing) {
    existing.qty++;
  } else {
    cart.push({ ...item, qty: 1 });
  }

  updateCartUI();
  showToast(`${item.name} added to cart!`);
}

// Add Combo Deal to Cart
function addComboToCart() {
  const combo = {
    id: 99,
    name: "Biryani + Zinger Combo",
    price: 890,
    qty: 1
  };
  const existing = cart.find(i => i.id === 99);
  if (existing) {
    existing.qty++;
  } else {
    cart.push(combo);
  }
  updateCartUI();
  showToast("Combo Deal added to cart!");
}

// Adjust Quantity
function updateQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (!item) return;

  item.qty += delta;
  if (item.qty <= 0) {
    cart = cart.filter(i => i.id !== id);
  }
  updateCartUI();
}

// Update Cart UI Drawer
function updateCartUI() {
  const badge = document.getElementById("cart-badge");
  const cartContainer = document.getElementById("cart-items");
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);

  badge.textContent = totalItems;

  if (cart.length === 0) {
    cartContainer.innerHTML = `<p style="color: var(--text-muted); text-align: center; margin-top: 2rem;">Your cart is currently empty.</p>`;
    document.getElementById("subtotal-val").textContent = "Rs. 0";
    document.getElementById("total-val").textContent = "Rs. 100";
    return;
  }

  cartContainer.innerHTML = "";
  let subtotal = 0;

  cart.forEach(item => {
    subtotal += item.price * item.qty;
    const itemEl = document.createElement("div");
    itemEl.className = "cart-item";
    itemEl.innerHTML = `
      <div>
        <div class="cart-item-title">${item.name}</div>
        <div class="cart-item-price">Rs. ${item.price * item.qty}</div>
      </div>
      <div class="qty-controls">
        <button class="qty-btn" onclick="updateQty(${item.id}, -1)">-</button>
        <span>${item.qty}</span>
        <button class="qty-btn" onclick="updateQty(${item.id}, 1)">+</button>
      </div>
    `;
    cartContainer.appendChild(itemEl);
  });

  const deliveryFee = 100;
  document.getElementById("subtotal-val").textContent = `Rs. ${subtotal}`;
  document.getElementById("total-val").textContent = `Rs. ${subtotal + deliveryFee}`;
}

// Toggle Cart Drawer Visibility
function toggleCart() {
  document.getElementById("cart-drawer").classList.toggle("active");
  document.getElementById("cart-overlay").classList.toggle("active");
}

// Toast Alert
function showToast(msg) {
  const toast = document.getElementById("toast");
  document.getElementById("toast-text").textContent = msg;
  toast.classList.add("active");
  setTimeout(() => {
    toast.classList.remove("active");
  }, 2500);
}

// WhatsApp Order Generator
function checkoutWhatsApp() {
  if (cart.length === 0) {
    alert("Please add items to your cart before checking out.");
    return;
  }

  const name = document.getElementById("cust-name").value.trim();
  const address = document.getElementById("cust-address").value.trim();
  const notes = document.getElementById("cust-notes").value.trim();

  if (!name || !address) {
    alert("Please enter your name and delivery address.");
    return;
  }

  let itemSummary = "";
  let subtotal = 0;

  cart.forEach(item => {
    const itemTotal = item.price * item.qty;
    subtotal += itemTotal;
    itemSummary += `• ${item.name} x${item.qty} - Rs. ${itemTotal}\n`;
  });

  const total = subtotal + 100;

  let text = `*NEW ORDER - CRAVE KITCHEN*\n\n`;
  text += `*Customer:* ${name}\n`;
  text += `*Address:* ${address}\n`;
  if (notes) text += `*Instructions:* ${notes}\n`;
  text += `\n*ITEMS ORDERED:*\n${itemSummary}\n`;
  text += `Subtotal: Rs. ${subtotal}\n`;
  text += `Delivery Fee: Rs. 100\n`;
  text += `*TOTAL AMOUNT: Rs. ${total}*\n\n`;
  text += `Please confirm my order and estimated delivery time!`;

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
  window.open(url, "_blank");
}