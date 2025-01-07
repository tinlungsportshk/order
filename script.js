const productList = document.getElementById("product-list");
const searchInput = document.getElementById("search");
const bagPopup = document.getElementById("shopping-bag-popup");
const closePopup = document.getElementById("close-popup");
const bagItems = [];
let totalPrice = 0;
let products = []; // Will hold the products loaded from the Excel file

// Load Products from Excel File
function loadProductsFromExcel() {
  fetch('products.xlsx')
    .then(response => response.arrayBuffer())
    .then(data => {
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      products = XLSX.utils.sheet_to_json(firstSheet); // Load products into global variable

      renderProducts(products);
    })
    .catch(error => console.error("Error loading products:", error));
}

// Render Products on the Page
function renderProducts(products) {
  productList.innerHTML = "";
  const searchTerm = searchInput.value.toLowerCase();

  products.forEach(product => {
    if (product.Name.toLowerCase().includes(searchTerm)) {
      const quantity = getQuantity(product.ID);
      productList.innerHTML += `
        <div class="product" id="product-${product.ID}">
          <img src="${product.Image}" alt="${product.Name}">
          <h4>${product.Name}</h4>
          <p>$${product.Price}</p>
          ${
            quantity === 0
              ? `<button onclick="addToBag(${product.ID})">
                   <i class="fas fa-shopping-bag"></i> 加入購物袋
                 </button>`
              : `
                <div class="quantity-controls">
                  <button onclick="decreaseQuantity(${product.ID})">-</button>
                  <span id="product-amount-${product.ID}">${quantity}</span>
                  <button onclick="increaseQuantity(${product.ID})">+</button>
                </div>
              `
          }
        </div>
      `;
    }
  });
}

// Add a Product to the Shopping Bag
function addToBag(id) {
  const existingItem = bagItems.find(item => item.ID === id);
  if (existingItem) {
    existingItem.quantity++;
  } else {
    const product = products.find(p => p.ID === id);
    bagItems.push({ ...product, quantity: 1 });
  }
  updateBag();
  renderProducts(products);
}

// Increase Quantity
function increaseQuantity(id) {
  const item = bagItems.find(i => i.ID === id);
  if (item) item.quantity++;
  updateBag();
  renderProducts(products);
}

// Decrease Quantity
function decreaseQuantity(id) {
  const itemIndex = bagItems.findIndex(i => i.ID === id);
  if (itemIndex > -1) {
    if (bagItems[itemIndex].quantity > 1) {
      bagItems[itemIndex].quantity--;
    } else {
      bagItems.splice(itemIndex, 1);
    }
  }
  updateBag();
  renderProducts(products);
}

// Get Quantity of a Product
function getQuantity(id) {
  const item = bagItems.find(i => i.ID === id);
  return item ? item.quantity : 0;
}

// Update Shopping Bag Popup
function updateBag() {
  const bagTable = document.getElementById("bag-items");
  bagTable.innerHTML = "";
  totalPrice = 0;

  bagItems.forEach(item => {
    const total = item.Price * item.quantity;
    totalPrice += total;

    bagTable.innerHTML += `
      <tr>
        <td>${item.Name}</td>
        <td>$${item.Price}</td>
        <td class="quantity-controls">
          <button onclick="decreaseQuantity(${item.ID})">-</button>
          <span>${item.quantity}</span>
          <button onclick="increaseQuantity(${item.ID})">+</button>
        </td>
        <td>$${total}</td>
      </tr>
    `;
  });

  document.getElementById("total-price").innerText = totalPrice;
  document.getElementById("item-count").innerText = bagItems.reduce(
    (acc, item) => acc + item.quantity,
    0
  );
}

// Confirm Order through WhatsApp
document.getElementById("confirm-order").addEventListener("click", () => {
  const userName = document.getElementById("user-name").value.trim();
  const userEmail = document.getElementById("user-email").value.trim();
  const userPhone = document.getElementById("user-phone").value.trim();

  if (!userName || !validateEmail(userEmail) || !userPhone) {
    alert("請填寫姓名、有效的電子郵件和電話號碼！");
    return;
  }

  const now = new Date();
  const hongKongTime = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Hong_Kong',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).format(now).replace(/[/, ]/g, "").replace(/:/g, "");

  const orderNumber = `${userName}-${hongKongTime}`;
  const orderDetails = bagItems
    .map(item => `${item.Name} x${item.quantity} = $${item.Price * item.quantity}`)
    .join("%0A");

  const totalLine = `總金額: $${totalPrice}`;
  const whatsappMessage = `您好，%0A%0A以下是我的訂單詳細資訊：%0A%0A訂單編號: ${orderNumber}%0A姓名: ${userName}%0A電郵: ${userEmail}%0A電話: ${userPhone}%0A%0A${orderDetails}%0A${totalLine}%0A%0A謝謝！`;

  window.location.href = `https://wa.me/85261726808?text=${whatsappMessage}`;
});

// Email Validation Function
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Search Input Event Listener
searchInput.addEventListener("input", () => renderProducts(products));
document.getElementById("shopping-bag").addEventListener("click", () => {
  bagPopup.classList.remove("hidden");
});
closePopup.addEventListener("click", () => {
  bagPopup.classList.add("hidden");
});

// Load products initially
loadProductsFromExcel();



document.querySelectorAll('.tab-button').forEach(button => {
  button.addEventListener('click', () => {
    const tab = button.getAttribute('data-tab');

    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(content => {
      content.style.display = 'none';
    });

    // Remove 'active' class from all buttons
    document.querySelectorAll('.tab-button').forEach(btn => {
      btn.classList.remove('active');
    });

    // Show the selected tab and highlight its button
    document.getElementById(tab).style.display = 'block';
    button.classList.add('active');
  });
});

// Show the Equipment tab by default
document.getElementById('equipment').style.display = 'block';