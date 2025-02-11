document.addEventListener('DOMContentLoaded', () => {
    // Cache DOM elements for the order page
    const categoriesContainer = document.getElementById('order-categories');
    const itemsContainer = document.getElementById('order-items');
    const orderSummaryEl = document.getElementById('order-summary');
    const totalPriceEl = document.getElementById('total-price');
    const placeOrderBtn = document.getElementById('placeOrderBtn');
  
    // Global variable to store the current order: an array of objects { id, name, price, quantity }
    let currentOrder = [];
  
    // Fetch menu structure from the API
    async function fetchMenuStructure() {
      try {
        const response = await fetch('/structure/menu/get_structure');
        const data = await response.json();
        return data;
      } catch (error) {
        console.error("Error fetching menu structure:", error);
        alert("Error loading menu structure.");
        return [];
      }
    }
  
    // Render categories as horizontally scrollable buttons
    async function renderCategories() {
      const structure = await fetchMenuStructure();
      categoriesContainer.innerHTML = ''; // Clear previous categories
  
      structure.forEach(group => {
        const btn = document.createElement('button');
        btn.classList.add('btn', 'btn-secondary', 'category-btn');
        btn.style.marginRight = '10px';
        btn.textContent = group.name;
        btn.addEventListener('click', () => {
          renderItemsForCategory(group);
        });
        categoriesContainer.appendChild(btn);
      });
    }
  
    // Render items for a given category (main group)
    function renderItemsForCategory(group) {
      itemsContainer.innerHTML = ''; // Clear previous items
  
      // Loop through each subgroup and render a header (optional) and its items
      group.subgroups.forEach(subGroup => {
        // Create a header for the subgroup
        const subHeader = document.createElement('h4');
        subHeader.textContent = subGroup.name;
        subHeader.style.width = '100%';
        itemsContainer.appendChild(subHeader);
  
        // Render each menu item in this subgroup as a touch-friendly card
        subGroup.menu_items.forEach(item => {
          const itemCard = document.createElement('div');
          itemCard.classList.add('item-card');
          // You can add more styling via CSS to make these cards look nice
          itemCard.style.display = 'inline-block';
          itemCard.style.width = '45%';
          itemCard.style.margin = '5px';
          itemCard.style.padding = '10px';
          itemCard.style.border = '1px solid var(--secondary-color)';
          itemCard.style.borderRadius = '8px';
          itemCard.style.boxShadow = 'var(--box-shadow-light)';
          itemCard.innerHTML = `
            <h5>${item.name}</h5>
            <p>£${parseFloat(item.price).toFixed(2)}</p>
            <button class="btn primary-btn" style="width: 100%;">Add to Order</button>
          `;
          // When the button is tapped, add the item to the order
          itemCard.querySelector('button').addEventListener('click', () => {
            addToOrder(item);
          });
          itemsContainer.appendChild(itemCard);
        });
      });
    }
  
    // Add an item to the current order (if it exists, increment quantity)
    function addToOrder(item) {
      const existing = currentOrder.find(orderItem => orderItem.id === item.id);
      if (existing) {
        existing.quantity++;
      } else {
        currentOrder.push({
          id: item.id,
          name: item.name,
          price: parseFloat(item.price),
          quantity: 1
        });
      }
      updateOrderSummary();
    }
  
    // Update the sidebar order summary and total price
    function updateOrderSummary() {
      orderSummaryEl.innerHTML = '';
      let total = 0;
      currentOrder.forEach(orderItem => {
        const li = document.createElement('li');
        li.classList.add('list-group-item');
        li.textContent = `${orderItem.name} x ${orderItem.quantity} - £${(orderItem.price * orderItem.quantity).toFixed(2)}`;
        orderSummaryEl.appendChild(li);
        total += orderItem.price * orderItem.quantity;
      });
      totalPriceEl.textContent = `£${total.toFixed(2)}`;
    }
  
    // Place order (simulate order submission)
    placeOrderBtn.addEventListener('click', () => {
      if (currentOrder.length === 0) {
        alert("Your order is empty. Please add items.");
        return;
      }
      // Here you would send the order to a backend API. For now, we'll simulate.
      alert("Order placed successfully!");
      // Clear the order and update summary
      currentOrder = [];
      updateOrderSummary();
    });
  
    // Initial render of categories when the page loads.
    renderCategories();
  });
  