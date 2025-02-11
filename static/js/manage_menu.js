document.addEventListener('DOMContentLoaded', () => {
  // Cache DOM elements for structure display
  const menuStructureContainer = document.getElementById('menu-structure');
  const refreshStructureBtn = document.getElementById('refreshStructureBtn');

  // Buttons to open modals
  const addMainGroupBtn = document.getElementById('addMainGroupBtn');
  const addSubGroupBtn = document.getElementById('addSubGroupBtn');
  const addMenuItemBtn = document.getElementById('addMenuItemBtn');
  const addAddOnBtn = document.getElementById('addAddOnBtn');

  // Modal Containers
  const mainGroupFormContainer = document.getElementById('mainGroupFormContainer');
  const subGroupFormContainer = document.getElementById('subGroupFormContainer');
  const menuItemFormContainer = document.getElementById('menuItemFormContainer');
  const addOnFormContainer = document.getElementById('addOnFormContainer');

  // Close buttons for modals
  const closeMainGroupForm = document.getElementById('closeMainGroupForm');
  const closeSubGroupForm = document.getElementById('closeSubGroupForm');
  const closeMenuItemForm = document.getElementById('closeMenuItemForm');
  const closeAddOnForm = document.getElementById('closeAddOnForm');

  // Forms
  const mainGroupForm = document.getElementById('mainGroupForm');
  const subGroupForm = document.getElementById('subGroupForm');
  const menuItemForm = document.getElementById('menuItemForm');
  const addOnForm = document.getElementById('addOnForm');

  // Dropdowns for parent selection in forms
  const parentMainGroupSelect = document.getElementById('parentMainGroup');
  const parentSubGroupSelect = document.getElementById('parentSubGroup');
  const parentMenuItemSelect = document.getElementById('parentMenuItem');

  // Submit buttons
  const mainGroupSubmitButton = document.getElementById('mainGroupSubmitButton');
  const subGroupSubmitButton = document.getElementById('subGroupSubmitButton');
  const menuItemSubmitButton = document.getElementById('menuItemSubmitButton');
  const addOnSubmitButton = document.getElementById('addOnSubmitButton');

  // State variables for edit operations
  let editingMainGroupId = null;
  let editingSubGroupId = null;
  let editingMenuItemId = null;
  let editingAddOnId = null;

  // Flag to prevent duplicate submissions for main group form
  let isSubmittingMainGroup = false;

  // Utility: Show/hide modal
  function showModal(modal) { modal.style.display = 'flex'; }
  function hideModal(modal) { modal.style.display = 'none'; }

  // New: Cache elements for upgrade options in menu item form
  const menuItemUpgradableCheckbox = document.getElementById('menuItemUpgradable');
  const upgradeOptionsContainer = document.getElementById('upgradeOptions');
  // Meal Upgrade Modal Elements
  const mealUpgradeFormContainer = document.getElementById('mealUpgradeFormContainer');
  const closeMealUpgradeForm = document.getElementById('closeMealUpgradeForm');
  const mealUpgradeForm = document.getElementById('mealUpgradeForm');
  const mealUpgradeMenuItemId = document.getElementById('mealUpgradeMenuItemId');
  const mealUpgradeDrinkSelect = document.getElementById('mealUpgradeDrinkSelect');
  const mealUpgradeDrinkPrice = document.getElementById('mealUpgradeDrinkPrice');
  const mealUpgradeSideSelect = document.getElementById('mealUpgradeSideSelect');
  const mealUpgradeSidePrice = document.getElementById('mealUpgradeSidePrice');
  const mealUpgradeSubmitButton = document.getElementById('mealUpgradeSubmitButton');
  
    // Hide all modals on page load
  hideModal(mainGroupFormContainer);
  hideModal(subGroupFormContainer);
  hideModal(menuItemFormContainer);
  hideModal(addOnFormContainer);
  hideModal(mealUpgradeFormContainer);

  // Toggle upgrade options visibility based on checkbox
  menuItemUpgradableCheckbox.addEventListener('change', () => {
    if (menuItemUpgradableCheckbox.checked) {
      upgradeOptionsContainer.style.display = 'block';
    } else {
      upgradeOptionsContainer.style.display = 'none';
    }
  });

  // Function to populate the drink dropdown from the Drinks main group
  async function populateMealUpgradeDrinkDropdown() {
    try {
      const response = await fetch('/structure/menu/get_structure');
      const data = await response.json();
      mealUpgradeDrinkSelect.innerHTML = '<option value="">Select Drink</option>';
      data.forEach(group => {
        if (group.name.toLowerCase() === "drinks") {
          group.subgroups.forEach(subGroup => {
            subGroup.menu_items.forEach(item => {
              const option = document.createElement('option');
              option.value = item.id;
              option.textContent = item.name;
              mealUpgradeDrinkSelect.appendChild(option);
            });
          });
        }
      });
    } catch (error) {
      console.error("Error fetching drinks for meal upgrade:", error);
    }
  }

  // Function to populate the side dropdown from the Sides main group
  async function populateMealUpgradeSideDropdown() {
    try {
      const response = await fetch('/structure/menu/get_structure');
      const data = await response.json();
      mealUpgradeSideSelect.innerHTML = '<option value="">Select Side</option>';
      data.forEach(group => {
        if (group.name.toLowerCase() === "sides") {
          group.subgroups.forEach(subGroup => {
            subGroup.menu_items.forEach(item => {
              const option = document.createElement('option');
              option.value = item.id;
              option.textContent = item.name;
              mealUpgradeSideSelect.appendChild(option);
            });
          });
        }
      });
    } catch (error) {
      console.error("Error fetching sides for meal upgrade:", error);
    }
  }

  // Function to open the meal upgrade modal for a given menu item id
  function openMealUpgradeModal(menuItemId) {
    mealUpgradeForm.reset();
    mealUpgradeMenuItemId.value = menuItemId;
    populateMealUpgradeDrinkDropdown();
    populateMealUpgradeSideDropdown();
    showModal(mealUpgradeFormContainer);
  }

  window.openMealUpgradeModal = openMealUpgradeModal;

  closeMealUpgradeForm.addEventListener('click', () => hideModal(mealUpgradeFormContainer));

  // Meal Upgrade Form Submission Handler
  mealUpgradeForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    mealUpgradeSubmitButton.disabled = true;
    const menu_item_id = mealUpgradeMenuItemId.value;
    const drink_item_id = mealUpgradeDrinkSelect.value;
    const side_item_id = mealUpgradeSideSelect.value;
    const custom_drink_price = mealUpgradeDrinkPrice.value.trim();
    const custom_side_price = mealUpgradeSidePrice.value.trim();
    if (!menu_item_id) {
      alert("Menu item ID is required.");
      mealUpgradeSubmitButton.disabled = false;
      return;
    }
    try {
      const response = await fetch('/meal_upgrade/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          menu_item_id,
          drink_item_id,
          side_item_id,
          custom_drink_price,
          custom_side_price
        })
      });
      const data = await response.json();
      if (!response.ok) {
        alert(data.error || "Error processing meal upgrade option.");
        return;
      }
      alert(data.message);
      hideModal(mealUpgradeFormContainer);
      // Optionally refresh structure if needed
      fetchStructure();
    } catch (error) {
      console.error("Error processing meal upgrade option:", error);
      alert("Error processing meal upgrade option. Please try again.");
    } finally {
      mealUpgradeSubmitButton.disabled = false;
    }
  });

  // Fetch and render entire menu structure
  async function fetchStructure() {
    try {
      const response = await fetch('/structure/menu/get_structure');
      const data = await response.json();
      renderStructure(data);
    } catch (error) {
      console.error("Error fetching structure:", error);
      alert("Error loading menu structure.");
    }
  }

  // Render hierarchical structure
  function renderStructure(data) {
    menuStructureContainer.innerHTML = '';
    data.forEach(mainGroup => {
      const groupDiv = document.createElement('div');
      groupDiv.classList.add('main-group');
      groupDiv.innerHTML = `<h2>${mainGroup.name} 
        <button onclick="editMainGroup('${mainGroup.id}', '${mainGroup.name}')">Edit</button>
        <button onclick="deleteMainGroup('${mainGroup.id}')">Delete</button>
      </h2>`;
      mainGroup.subgroups.forEach(subGroup => {
        const subDiv = document.createElement('div');
        subDiv.classList.add('sub-group');
        subDiv.innerHTML = `<h3>${subGroup.name} 
          <button onclick="editSubGroup('${subGroup.id}', '${subGroup.name}', '${mainGroup.id}')">Edit</button>
          <button onclick="deleteSubGroup('${subGroup.id}')">Delete</button>
        </h3>`;
        subGroup.menu_items.forEach(item => {
          const itemDiv = document.createElement('div');
          itemDiv.classList.add('menu-item');
          itemDiv.innerHTML = `<p>${item.name} - £${item.price} 
            <button onclick="editMenuItem('${item.id}', '${item.name}', '${item.price}', '${subGroup.id}', '${item.upgradable}', '${item.upgrade_drink_price}', '${item.upgrade_side_price}')">Edit</button>
            <button onclick="deleteMenuItem('${item.id}')">Delete</button>
            <button onclick="openMealUpgradeModal('${item.id}')">Manage Meal Upgrade Options</button>
          </p>`;
          if (item.addons && item.addons.length > 0) {
            const addonList = document.createElement('ul');
            item.addons.forEach(addon => {
              const li = document.createElement('li');
              li.innerHTML = `${addon.name} - £${addon.price} 
                <button onclick="editAddOn('${addon.id}', '${addon.name}', '${addon.price}', '${item.id}')">Edit</button>
                <button onclick="deleteAddOn('${addon.id}')">Delete</button>`;
              addonList.appendChild(li);
            });
            itemDiv.appendChild(addonList);
          }
          subDiv.appendChild(itemDiv);
        });
        groupDiv.appendChild(subDiv);
      });
      menuStructureContainer.appendChild(groupDiv);
    });
  }

  // Fetch dropdown options for main groups (for subgroup form)
  async function populateMainGroupDropdown() {
    try {
      const response = await fetch('/structure/menu/get_structure');
      const data = await response.json();
      parentMainGroupSelect.innerHTML = '<option value="">Select Main Group</option>';
      data.forEach(group => {
        const option = document.createElement('option');
        option.value = group.id;
        option.textContent = group.name;
        parentMainGroupSelect.appendChild(option);
      });
    } catch (error) { console.error("Error fetching main groups:", error); }
  }

  // Fetch dropdown options for subgroups (for menu item form)
  async function populateSubGroupDropdown() {
    try {
      const response = await fetch('/structure/menu/get_structure');
      const data = await response.json();
      parentSubGroupSelect.innerHTML = '<option value="">Select Subgroup</option>';
      data.forEach(group => {
        group.subgroups.forEach(subGroup => {
          const option = document.createElement('option');
          option.value = subGroup.id;
          option.textContent = `${group.name} > ${subGroup.name}`;
          parentSubGroupSelect.appendChild(option);
        });
      });
    } catch (error) { console.error("Error fetching subgroups:", error); }
  }

  // Fetch dropdown options for menu items (for add-on form)
  async function populateMenuItemDropdown() {
    try {
      const response = await fetch('/structure/menu/get_structure');
      const data = await response.json();
      parentMenuItemSelect.innerHTML = '<option value="">Select Menu Item</option>';
      data.forEach(group => {
        group.subgroups.forEach(subGroup => {
          subGroup.menu_items.forEach(item => {
            const option = document.createElement('option');
            option.value = item.id;
            option.textContent = `${group.name} > ${subGroup.name} > ${item.name}`;
            parentMenuItemSelect.appendChild(option);
          });
        });
      });
    } catch (error) { console.error("Error fetching menu items for add-on dropdown:", error); }
  }

  // Initial fetch for structure and dropdowns
  fetchStructure();
  populateMainGroupDropdown();
  populateSubGroupDropdown();
  populateMenuItemDropdown();

  // Refresh button handler
  refreshStructureBtn.addEventListener('click', () => {
    fetchStructure();
    populateMainGroupDropdown();
    populateSubGroupDropdown();
    populateMenuItemDropdown();
  });

  // ------------------------------
  // Modal Open/Close Handlers
  // ------------------------------
  addMainGroupBtn.addEventListener('click', () => {
    mainGroupForm.reset();
    editingMainGroupId = null;
    document.getElementById('mainGroupModalTitle').textContent = "Add Main Group";
    showModal(mainGroupFormContainer);
  });

  addSubGroupBtn.addEventListener('click', async () => {
    subGroupForm.reset();
    editingSubGroupId = null;
    document.getElementById('subGroupModalTitle').textContent = "Add Subgroup";
    await populateMainGroupDropdown();
    showModal(subGroupFormContainer);
  });

  addMenuItemBtn.addEventListener('click', async () => {
    menuItemForm.reset();
    editingMenuItemId = null;
    document.getElementById('menuItemModalTitle').textContent = "Add Menu Item";
    // Reset upgrade options
    document.getElementById('menuItemUpgradable').checked = false;
    upgradeOptionsContainer.style.display = 'none';
    // Clear any previous upgrade prices
    document.getElementById('upgradeDrinkPrice').value = '';
    document.getElementById('upgradeSidePrice').value = '';
    await populateSubGroupDropdown();
    showModal(menuItemFormContainer);
  });

  addAddOnBtn.addEventListener('click', async () => {
    addOnForm.reset();
    editingAddOnId = null;
    document.getElementById('addOnModalTitle').textContent = "Add Add-On";
    await populateMenuItemDropdown();
    showModal(addOnFormContainer);
  });

  closeMainGroupForm.addEventListener('click', () => hideModal(mainGroupFormContainer));
  closeSubGroupForm.addEventListener('click', () => hideModal(subGroupFormContainer));
  closeMenuItemForm.addEventListener('click', () => hideModal(menuItemFormContainer));
  closeAddOnForm.addEventListener('click', () => hideModal(addOnFormContainer));

  // ------------------------------
  // Form Submission Handlers
  // ------------------------------

  // Main Group Form Submission Handler with duplicate submission prevention
  mainGroupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (isSubmittingMainGroup) return;  // Prevent duplicate submissions
    isSubmittingMainGroup = true;

    const name = document.getElementById('mainGroupName').value.trim();
    if (!name) {
      alert("Main group name is required.");
      isSubmittingMainGroup = false;
      return;
    }
    mainGroupSubmitButton.disabled = true;
    try {
      const url = editingMainGroupId ? `/main_group/update/${editingMainGroupId}` : '/main_group/add';
      const method = editingMainGroupId ? 'PUT' : 'POST';
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      });
      const data = await response.json();
      if (!response.ok) {
        alert(data.error || "Error processing request.");
        return;
      }
      alert(data.message);
      hideModal(mainGroupFormContainer);
      fetchStructure();
      populateMainGroupDropdown();
      populateSubGroupDropdown();
      populateMenuItemDropdown();
    } catch (error) {
      console.error("Error processing main group form:", error);
      alert("Error processing main group. Please try again.");
    } finally {
      mainGroupSubmitButton.disabled = false;
      isSubmittingMainGroup = false;
    }
  });

  // Subgroup Form Submission Handler
  subGroupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('subGroupName').value.trim();
    const main_group_id = parentMainGroupSelect.value;
    if (!name || !main_group_id) { alert("Subgroup name and parent main group are required."); return; }
    subGroupSubmitButton.disabled = true;
    try {
      const url = editingSubGroupId ? `/subgroup/update/${editingSubGroupId}` : '/subgroup/add';
      const method = editingSubGroupId ? 'PUT' : 'POST';
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, main_group_id })
      });
      const data = await response.json();
      if (!response.ok) { alert(data.error || "Error processing request."); return; }
      alert(data.message);
      hideModal(subGroupFormContainer);
      fetchStructure();
      populateSubGroupDropdown();
      populateMenuItemDropdown();
    } catch (error) {
      console.error("Error processing subgroup form:", error);
      alert("Error processing subgroup. Please try again.");
    } finally { subGroupSubmitButton.disabled = false; }
  });


  // Menu Item Form Submission Handler (updated for upgrade option)
  menuItemForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('menuItemName').value.trim();
    const price = document.getElementById('menuItemPrice').value.trim();
    const sub_group_id = parentSubGroupSelect.value;
    // Get upgrade option values
    const upgradable = document.getElementById('menuItemUpgradable').checked;
    let upgrade_drink_price = null;
    let upgrade_side_price = null;
    if (upgradable) {
      upgrade_drink_price = document.getElementById('upgradeDrinkPrice').value.trim();
      upgrade_side_price = document.getElementById('upgradeSidePrice').value.trim();
    }
    if (!name || !price || !sub_group_id) {
      alert("Menu item name, price and parent subgroup are required.");
      return;
    }
    menuItemSubmitButton.disabled = true;
    try {
      const url = editingMenuItemId ? `/menu_item/update/${editingMenuItemId}` : '/menu_item/add';
      const method = editingMenuItemId ? 'PUT' : 'POST';
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, price, sub_group_id, upgradable, upgrade_drink_price, upgrade_side_price })
      });
      const data = await response.json();
      if (!response.ok) { alert(data.error || "Error processing request."); return; }
      alert(data.message);
      hideModal(menuItemFormContainer);
      fetchStructure();
      populateSubGroupDropdown();
      populateMenuItemDropdown();
    } catch (error) {
      console.error("Error processing menu item form:", error);
      alert("Error processing menu item. Please try again.");
    } finally { menuItemSubmitButton.disabled = false; }
  });

  // Add-On Form Submission Handler
  addOnForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('addOnName').value.trim();
    const price = document.getElementById('addOnPrice').value.trim();
    const menu_item_id = parentMenuItemSelect.value;
    if (!name || !price || !menu_item_id) { alert("Add-on name, price and parent menu item are required."); return; }
    addOnSubmitButton.disabled = true;
    try {
      const url = editingAddOnId ? `/addon/update/${editingAddOnId}` : '/addon/add';
      const method = editingAddOnId ? 'PUT' : 'POST';
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, price, menu_item_id })
      });
      const data = await response.json();
      if (!response.ok) { alert(data.error || "Error processing request."); return; }
      alert(data.message);
      hideModal(addOnFormContainer);
      fetchStructure();
      populateMenuItemDropdown();
    } catch (error) {
      console.error("Error processing add-on form:", error);
      alert("Error processing add-on. Please try again.");
    } finally { addOnSubmitButton.disabled = false; }
  });

  // ------------------------------
  // Global Functions for Edit/Delete (attached to window)
  // ------------------------------
  window.editMainGroup = (id, name) => {
    document.getElementById('mainGroupName').value = name;
    editingMainGroupId = id;
    document.getElementById('mainGroupModalTitle').textContent = "Edit Main Group";
    showModal(mainGroupFormContainer);
  };

  window.deleteMainGroup = async (id) => {
    if (!confirm("Are you sure you want to delete this main group?")) return;
    try {
      const response = await fetch(`/main_group/delete/${id}`, { method: 'DELETE' });
      const data = await response.json();
      if (!response.ok) { throw new Error(data.error || "Error deleting main group"); }
      alert(data.message);
      fetchStructure();
      populateMainGroupDropdown();
      populateSubGroupDropdown();
      populateMenuItemDropdown();
    } catch (error) {
      console.error("Error deleting main group:", error);
      alert(error.message || "Error deleting main group.");
    }
  };

  window.editSubGroup = (id, name, main_group_id) => {
    document.getElementById('subGroupName').value = name;
    parentMainGroupSelect.value = main_group_id;
    editingSubGroupId = id;
    document.getElementById('subGroupModalTitle').textContent = "Edit Subgroup";
    showModal(subGroupFormContainer);
  };

  window.deleteSubGroup = async (id) => {
    if (!confirm("Are you sure you want to delete this subgroup?")) return;
    try {
      const response = await fetch(`/subgroup/delete/${id}`, { method: 'DELETE' });
      const data = await response.json();
      if (!response.ok) { throw new Error(data.error || "Error deleting subgroup"); }
      alert(data.message);
      fetchStructure();
      populateSubGroupDropdown();
      populateMenuItemDropdown();
    } catch (error) {
      console.error("Error deleting subgroup:", error);
      alert(error.message || "Error deleting subgroup.");
    }
  };

  window.editMenuItem = (id, name, price, sub_group_id, upgradable, upgrade_drink_price, upgrade_side_price) => {
    // Fill in the basic fields
    document.getElementById('menuItemName').value = name;
    document.getElementById('menuItemPrice').value = price;
    parentSubGroupSelect.value = sub_group_id;
    editingMenuItemId = id;
    document.getElementById('menuItemModalTitle').textContent = "Edit Menu Item";
    showModal(menuItemFormContainer);
    
    // Set the upgrade option
    if (upgradable) {
      document.getElementById('menuItemUpgradable').checked = true;
      upgradeOptionsContainer.style.display = 'block';
      document.getElementById('upgradeDrinkPrice').value = upgrade_drink_price ? upgrade_drink_price : '';
      document.getElementById('upgradeSidePrice').value = upgrade_side_price ? upgrade_side_price : '';
    } else {
      document.getElementById('menuItemUpgradable').checked = false;
      upgradeOptionsContainer.style.display = 'none';
      document.getElementById('upgradeDrinkPrice').value = '';
      document.getElementById('upgradeSidePrice').value = '';
    }
  };
  

  window.deleteMenuItem = async (id) => {
    if (!confirm("Are you sure you want to delete this menu item?")) return;
    try {
      const response = await fetch(`/menu_item/delete/${id}`, { method: 'DELETE' });
      const data = await response.json();
      if (!response.ok) { throw new Error(data.error || "Error deleting menu item"); }
      alert(data.message);
      fetchStructure();
      populateSubGroupDropdown();
      populateMenuItemDropdown();
    } catch (error) {
      console.error("Error deleting menu item:", error);
      alert(error.message || "Error deleting menu item.");
    }
  };

  window.editAddOn = (id, name, price, menu_item_id) => {
    document.getElementById('addOnName').value = name;
    document.getElementById('addOnPrice').value = price;
    parentMenuItemSelect.value = menu_item_id;
    editingAddOnId = id;
    document.getElementById('addOnModalTitle').textContent = "Edit Add-On";
    showModal(addOnFormContainer);
  };

  window.deleteAddOn = async (id) => {
    if (!confirm("Are you sure you want to delete this add-on?")) return;
    try {
      const response = await fetch(`/addon/delete/${id}`, { method: 'DELETE' });
      const data = await response.json();
      if (!response.ok) { throw new Error(data.error || "Error deleting add-on"); }
      alert(data.message);
      fetchStructure();
      populateMenuItemDropdown();
    } catch (error) {
      console.error("Error deleting add-on:", error);
      alert(error.message || "Error deleting add-on.");
    }
  };

});
