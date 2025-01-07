const products = [
    { id: 1, name: "47cm 有洞雪糕筒套裝 (10個)", price: 49, image: "images/52xuegao.jpg" },
    { id: 2, name: "32cm 有洞雪糕筒套裝 (8個)", price: 39, image: "images/32xuegao.jpg" },
    { id: 3, name: "單組記憶秒錶", price: 183, image: "images/timer.jpg" },
    { id: 4, name: "防水專用秒錶", price: 435, image: "images/waterprooftimer.jpg" },
    { id: 5, name: "籃球專用計分牌", price: 99, image: "images/jifenpai.jpg" },
    { id: 6, name: "三色豆袋", price: 128, image: "images/doudai.jpg" },
    { id: 7, name: "跳高軟橫杆", price: 329, image: "images/tiaogao.jpg" },
    { id: 8, name: "羽毛球拍柄帶 (30條)", price: 297, image: "images/badminton.jpg" }
  ];
  
  const productList = document.getElementById("product-list");
  const searchInput = document.getElementById("search");
  const bagPopup = document.getElementById("shopping-bag-popup");
  const closePopup = document.getElementById("close-popup");
  const bagItems = [];
  let totalPrice = 0;
  
  // Render Products on the Page
  function renderProducts() {
    productList.innerHTML = "";
    const searchTerm = searchInput.value.toLowerCase();
  
    products.forEach((product) => {
      if (product.name.toLowerCase().includes(searchTerm)) {
        const quantity = getQuantity(product.id);
        productList.innerHTML += `
          <div class="product" id="product-${product.id}">
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>$${product.price}</p>
            ${
              quantity === 0
                ? `<button onclick="addToBag(${product.id})">加入購物袋</button>`
                : `
                  <div class="quantity-controls">
                    <button onclick="decreaseQuantity(${product.id})">-</button>
                    <span id="product-amount-${product.id}">${quantity}</span>
                    <button onclick="increaseQuantity(${product.id})">+</button>
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
    const existingItem = bagItems.find((item) => item.id === id);
    if (existingItem) {
      existingItem.quantity++;
    } else {
      const product = products.find((p) => p.id === id);
      bagItems.push({ ...product, quantity: 1 });
    }
    updateBag();
    renderProducts();
  }
  
  // Increase Quantity
  function increaseQuantity(id) {
    const item = bagItems.find((i) => i.id === id);
    if (item) item.quantity++;
    updateBag();
    renderProducts();
  }
  
  // Decrease Quantity
  function decreaseQuantity(id) {
    const itemIndex = bagItems.findIndex((i) => i.id === id);
    if (itemIndex > -1) {
      if (bagItems[itemIndex].quantity > 1) {
        bagItems[itemIndex].quantity--;
      } else {
        bagItems.splice(itemIndex, 1);
      }
    }
    updateBag();
    renderProducts();
  }
  
  // Get Quantity of a Product
  function getQuantity(id) {
    const item = bagItems.find((i) => i.id === id);
    return item ? item.quantity : 0;
  }
  
  // Update Shopping Bag Popup
  function updateBag() {
    const bagTable = document.getElementById("bag-items");
    bagTable.innerHTML = "";
    totalPrice = 0;
  
    bagItems.forEach((item) => {
      const total = item.price * item.quantity;
      totalPrice += total;
  
      bagTable.innerHTML += `
        <tr>
          <td>${item.name}</td>
          <td>$${item.price}</td>
          <td class="quantity-controls">
            <button onclick="decreaseQuantity(${item.id})">-</button>
            <span>${item.quantity}</span>
            <button onclick="increaseQuantity(${item.id})">+</button>
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
  
  // Confirm Order through WhatsApp (Hong Kong Time)
  document.getElementById("confirm-order").addEventListener("click", () => {
    const userName = document.getElementById("user-name").value.trim();
    const userEmail = document.getElementById("user-email").value.trim();
    const userPhone = document.getElementById("user-phone").value.trim();
  
    if (!userName || !validateEmail(userEmail) || !userPhone) {
      alert("請填寫姓名、有效的電子郵件和電話號碼！");
      return;
    }
  
    // Get current time in Hong Kong timezone
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
      .map((item) => `${item.name} x${item.quantity} = $${item.price * item.quantity}`)
      .join("%0A");
  
    const totalLine = `總金額: $${totalPrice}`;
    const whatsappMessage = `您好，%0A%0A以下是我的訂單詳細資訊：%0A%0A訂單編號: ${orderNumber}%0A姓名: ${userName}%0A電郵: ${userEmail}%0A電話: ${userPhone}%0A%0A${orderDetails}%0A${totalLine}%0A%0A謝謝！`;
  
    window.location.href = `https://wa.me/85261726808?text=${whatsappMessage}`;
  });
  
  // Email validation function
  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }
  
  // Event Listeners
  searchInput.addEventListener("input", renderProducts);
  document.getElementById("shopping-bag").addEventListener("click", () => {
    bagPopup.classList.remove("hidden");
  });
  closePopup.addEventListener("click", () => {
    bagPopup.classList.add("hidden");
  });
  
  // Initial Render
  renderProducts();
  