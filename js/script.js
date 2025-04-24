// Dữ liệu mẫu
let products = [
    { id: 1, name: 'Cà Phê Đen', price: 30000, image: 'image/capheden.jpg' },
    { id: 2, name: 'Cà Phê Sữa', price: 35000, image: 'image/caphesua.jpg' },
    { id: 3, name: 'Trà Sữa', price: 40000, image: 'image/trasua.jpg' },
];

let ingredients = [
    { id: 1, name: 'Cà Phê Hạt', quantity: 1000 },
    { id: 2, name: 'Sữa', quantity: 5000 },
    { id: 3, name: 'Đường', quantity: 2000 },
];

let orders = [];
let cart = [];

// Lưu dữ liệu vào localStorage
function saveData() {
    localStorage.setItem('products', JSON.stringify(products));
    localStorage.setItem('ingredients', JSON.stringify(ingredients));
    localStorage.setItem('orders', JSON.stringify(orders));
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Tải dữ liệu từ localStorage
function loadData() {
    const savedProducts = localStorage.getItem('products');
    const savedIngredients = localStorage.getItem('ingredients');
    const savedOrders = localStorage.getItem('orders');
    const savedCart = localStorage.getItem('cart');

    if (savedProducts) {
        const parsedProducts = JSON.parse(savedProducts);
        // Kiểm tra xem dữ liệu cũ có hợp lệ không
        if (parsedProducts.every(p => p.image && !p.image.includes('via.placeholder.com'))) {
            products = parsedProducts;
        }
    }
    if (savedIngredients) ingredients = JSON.parse(savedIngredients);
    if (savedOrders) orders = JSON.parse(savedOrders);
    if (savedCart) cart = JSON.parse(savedCart);
}

// Hiển thị menu
function displayMenu() {
    loadData();
    const menuDiv = document.getElementById('menu');
    if (!menuDiv) return;

    menuDiv.innerHTML = '';
    products.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.className = 'product';
        productDiv.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>${product.price.toLocaleString()} VNĐ</p>
            <button onclick="addToCart(${product.id})">Thêm vào giỏ</button>
        `;
        menuDiv.appendChild(productDiv);
    });
}

// Thêm sản phẩm vào giỏ hàng
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        cart.push(product);
        saveData();
        loadCart();
    }
}

// Hiển thị giỏ hàng
function loadCart() {
    const cartDiv = document.getElementById('cart');
    if (!cartDiv) return;

    if (cart.length === 0) {
        cartDiv.innerHTML = '<p>Giỏ hàng trống</p>';
        return;
    }

    cartDiv.innerHTML = '';
    cart.forEach((item, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'flex justify-between mb-2';
        itemDiv.innerHTML = `
            <span>${item.name} - ${item.price.toLocaleString()} VNĐ</span>
            <button class="delete" onclick="removeFromCart(${index})">Xóa</button>
        `;
        cartDiv.appendChild(itemDiv);
    });
}

// Xóa sản phẩm khỏi giỏ hàng
function removeFromCart(index) {
    cart.splice(index, 1);
    saveData();
    loadCart();
}

// Đặt hàng
function placeOrder() {
    const name = document.getElementById('customerName').value;
    const phone = document.getElementById('customerPhone').value;

    if (!name || !phone) {
        alert('Vui lòng điền đầy đủ thông tin!');
        return;
    }
    if (cart.length === 0) {
        alert('Giỏ hàng trống!');
        return;
    }

    const newOrder = {
        id: orders.length + 1,
        customer: { name, phone },
        items: [...cart],
        total: cart.reduce((sum, item) => sum + item.price, 0),
        date: new Date().toISOString(),
    };
    orders.push(newOrder);
    cart = [];
    saveData();
    loadCart();
    document.getElementById('customerName').value = '';
    document.getElementById('customerPhone').value = '';
    alert('Đặt hàng thành công!');
}

// Hiển thị nguyên liệu (cho nhân viên và chủ quán)
function displayIngredients() {
    loadData();
    const ingredientsDiv = document.getElementById('ingredients') || document.getElementById('ingredientsList');
    if (!ingredientsDiv) return;

    ingredientsDiv.innerHTML = '';
    ingredients.forEach(ingredient => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'flex justify-between mb-2';
        if (ingredientsDiv.id === 'ingredientsList') {
            itemDiv.innerHTML = `
                <span>${ingredient.name}: ${ingredient.quantity}g</span>
                <div>
                    <button class="edit" onclick="editIngredient(${ingredient.id})">Sửa</button>
                    <button class="delete" onclick="deleteIngredient(${ingredient.id})">Xóa</button>
                </div>
            `;
        } else {
            itemDiv.innerHTML = `<span>${ingredient.name}: ${ingredient.quantity}g</span>`;
        }
        ingredientsDiv.appendChild(itemDiv);
    });
}

// Hiển thị đơn hàng (cho nhân viên)
function displayOrders() {
    loadData();
    const ordersDiv = document.getElementById('orders');
    if (!ordersDiv) return;

    if (orders.length === 0) {
        ordersDiv.innerHTML = '<p>Chưa có đơn hàng</p>';
        return;
    }

    ordersDiv.innerHTML = '';
    orders.forEach(order => {
        const orderDiv = document.createElement('div');
        orderDiv.className = 'mb-4 border-b pb-2';
        orderDiv.innerHTML = `
            <p><strong>Khách hàng:</strong> ${order.customer.name} - ${order.customer.phone}</p>
            <p><strong>Món:</strong> ${order.items.map(item => item.name).join(', ')}</p>
            <p><strong>Tổng tiền:</strong> ${order.total.toLocaleString()} VNĐ</p>
            <p><strong>Thời gian:</strong> ${new Date(order.date).toLocaleString()}</p>
        `;
        ordersDiv.appendChild(orderDiv);
    });
}

// Hiển thị danh sách sản phẩm (cho chủ quán)
function displayProducts() {
    loadData();
    const productsDiv = document.getElementById('productsList');
    if (!productsDiv) return;

    productsDiv.innerHTML = '';
    products.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.className = 'flex justify-between mb-2';
        productDiv.innerHTML = `
            <span>${product.name} - ${product.price.toLocaleString()} VNĐ</span>
            <div>
                <button class="edit" onclick="editProduct(${product.id})">Sửa</button>
                <button class="delete" onclick="deleteProduct(${product.id})">Xóa</button>
            </div>
        `;
        productsDiv.appendChild(productDiv);
    });
    displayMenu(); // Cập nhật menu nếu đang ở trang khách hàng
}

// Thêm sản phẩm
function addProduct() {
    const name = document.getElementById('productName').value;
    const price = parseInt(document.getElementById('productPrice').value);
    const imageInput = document.getElementById('productImage');
    const file = imageInput.files[0];

    if (!name || !price || !file) {
        alert('Vui lòng điền đầy đủ thông tin!');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(event) {
        const imageBase64 = event.target.result;
        const newProduct = {
            id: products.length + 1,
            name,
            price,
            image: imageBase64,
        };
        products.push(newProduct);
        saveData();
        displayProducts();
        document.getElementById('productName').value = '';
        document.getElementById('productPrice').value = '';
        imageInput.value = '';
    };
    reader.readAsDataURL(file);
}

// Sửa sản phẩm
function editProduct(id) {
    const product = products.find(p => p.id === id);
    const name = prompt('Tên mới:', product.name);
    const price = parseInt(prompt('Giá mới:', product.price));

    if (name && price) {
        product.name = name;
        product.price = price;

        const changeImage = confirm('Bạn có muốn thay đổi ảnh không?');
        if (changeImage) {
            const imageInput = document.createElement('input');
            imageInput.type = 'file';
            imageInput.accept = 'image/*';
            imageInput.onchange = function(event) {
                const file = event.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        product.image = e.target.result;
                        saveData();
                        displayProducts();
                    };
                    reader.readAsDataURL(file);
                }
            };
            imageInput.click();
        } else {
            saveData();
            displayProducts();
        }
    }
}
// Xóa sản phẩm
function deleteProduct(id) {
    products = products.filter(p => p.id !== id);
    saveData();
    displayProducts();
}

// Thêm nguyên liệu
function addIngredient() {
    const name = document.getElementById('ingredientName').value;
    const quantity = parseInt(document.getElementById('ingredientQuantity').value);

    if (!name || !quantity) {
        alert('Vui lòng điền đầy đủ thông tin!');
        return;
    }

    const newIngredient = {
        id: ingredients.length + 1,
        name,
        quantity,
    };
    ingredients.push(newIngredient);
    saveData();
    displayIngredients();
    document.getElementById('ingredientName').value = '';
    document.getElementById('ingredientQuantity').value = '';
}

// Sửa nguyên liệu
function editIngredient(id) {
    const ingredient = ingredients.find(i => i.id === id);
    const name = prompt('Tên mới:', ingredient.name);
    const quantity = parseInt(prompt('Số lượng mới:', ingredient.quantity));

    if (name && quantity) {
        ingredient.name = name;
        ingredient.quantity = quantity;
        saveData();
        displayIngredients();
    }
}

// Xóa nguyên liệu
function deleteIngredient(id) {
    ingredients = ingredients.filter(i => i.id !== id);
    saveData();
    displayIngredients();
}

// Xem báo cáo
function getReport(type) {
    loadData();
    const dateInput = type === 'day' ? document.getElementById('reportDate').value : document.getElementById('reportMonth').value;
    if (!dateInput) {
        alert('Vui lòng chọn ngày/tháng!');
        return;
    }

    const filteredOrders = orders.filter(order => {
        const orderDate = new Date(order.date);
        const selectedDate = new Date(dateInput);
        if (type === 'day') {
            return orderDate.toDateString() === selectedDate.toDateString();
        } else {
            return orderDate.getMonth() === selectedDate.getMonth() &&
                   orderDate.getFullYear() === selectedDate.getFullYear();
        }
    });

    const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.total, 0);
    const totalItems = filteredOrders.reduce((sum, order) => sum + order.items.length, 0);
    alert(`Doanh thu: ${totalRevenue.toLocaleString()} VNĐ\nSố món: ${totalItems}`);
}