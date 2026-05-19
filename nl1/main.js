// ==================== PRODUCTS DATA ====================
const API_BASE = window.location.protocol.startsWith('http')
  ? window.location.origin
  : 'https://fashion-shop-0w91.onrender.com';

const products = [
    {
        id: '001',
        name: 'Áo Thun Basic',
        category: 'Áo',
        price: 150000,
        image: '👕',
        rating: 4.5,
        sold: 320,
        createdAt: '2024-05-20',
        description: 'Áo thun trắng basic chất lượng cao'
    },
    {
        id: '002',
        name: 'Áo Sơ Mi Nam',
        category: 'Áo',
        price: 280000,
        image: '👔',
        rating: 4.8,
        sold: 210,
        createdAt: '2024-04-15',
        description: 'Áo sơ mi nam kiểu dáng hiện đại'
    },
    {
        id: '003',
        name: 'Áo Len Nữ',
        category: 'Áo',
        price: 320000,
        image: '🧥',
        rating: 4.6,
        sold: 410,
        createdAt: '2024-06-10',
        description: 'Áo len nữ ấm áp mùa đông'
    },
    {
        id: '004',
        name: 'Quần Jeans Xanh',
        category: 'Quần',
        price: 350000,
        image: '👖',
        rating: 4.7,
        sold: 190,
        createdAt: '2024-03-08',
        description: 'Quần jeans xanh đen cơ bản'
    },
    {
        id: '005',
        name: 'Quần Tây Nam',
        category: 'Quần',
        price: 280000,
        image: '👔',
        rating: 4.5,
        sold: 270,
        createdAt: '2024-05-05',
        description: 'Quần tây nam chất liệu cao cấp'
    },
    {
        id: '006',
        name: 'Quần Legging Nữ',
        category: 'Quần',
        price: 200000,
        image: '🩳',
        rating: 4.9,
        sold: 450,
        createdAt: '2024-06-12',
        description: 'Quần legging co giãn thoải mái'
    },
    {
        id: '007',
        name: 'Váy Hoa Nữ',
        category: 'Váy',
        price: 380000,
        image: '👗',
        rating: 4.8,
        sold: 380,
        createdAt: '2024-06-07',
        description: 'Váy hoa vintage hè 2024'
    },
    {
        id: '008',
        name: 'Váy Xếp Li',
        category: 'Váy',
        price: 320000,
        image: '👗',
        rating: 4.6,
        sold: 265,
        createdAt: '2024-04-29',
        description: 'Váy xếp li trắng sang trọng'
    },
    {
        id: '009',
        name: 'Giày Sneaker Trắng',
        category: 'Giày',
        price: 450000,
        image: '👟',
        rating: 4.9,
        sold: 520,
        createdAt: '2024-05-28',
        description: 'Giày sneaker trắng thoáng khí'
    },
    {
        id: '010',
        name: 'Giày Cao Gót',
        category: 'Giày',
        price: 380000,
        image: '👠',
        rating: 4.7,
        sold: 330,
        createdAt: '2024-05-22',
        description: 'Giày cao gót đen thanh lịch'
    },
    {
        id: '011',
        name: 'Dép Nữ',
        category: 'Giày',
        price: 180000,
        image: '👡',
        rating: 4.5,
        sold: 145,
        createdAt: '2024-05-29',
        description: 'Dép nữ đi nhà thoải mái'
    },
    {
        id: '012',
        name: 'Túi Xách',
        category: 'Phụ kiện',
        price: 550000,
        image: '👜',
        rating: 4.8,
        sold: 295,
        createdAt: '2024-06-02',
        description: 'Túi xách nữ da thật'
    },
    {
        id: '013',
        name: 'Ví Da Nam',
        category: 'Phụ kiện',
        price: 320000,
        image: '🎒',
        rating: 4.6,
        sold: 220,
        createdAt: '2024-04-18',
        description: 'Ví da nam cao cấp'
    },
    {
        id: '014',
        name: 'Mũ Lưỡi Trai',
        category: 'Phụ kiện',
        price: 120000,
        image: '🧢',
        rating: 4.4,
        sold: 125,
        createdAt: '2024-06-14',
        description: 'Mũ lưỡi trai nam nữ'
    },
    {
        id: '015',
        name: 'Dây Chuyền Vàng',
        category: 'Phụ kiện',
        price: 280000,
        image: '⛓️',
        rating: 4.7,
        sold: 205,
        createdAt: '2024-05-12',
        description: 'Dây chuyền vàng tinh tế'
    }
];
const STORAGE_PRODUCTS_KEY = 'products';
const STORAGE_ACTIVITY_KEY = 'activityLogs';
const STORAGE_CHAT_KEY = 'adminChatMessages';

function getStoredProducts() {
    const stored = localStorage.getItem(STORAGE_PRODUCTS_KEY);
    if (stored) {
        try {
            return JSON.parse(stored);
        } catch (error) {
            return products;
        }
    }
    return products;
}

function saveProducts(productList) {
    localStorage.setItem(STORAGE_PRODUCTS_KEY, JSON.stringify(productList));
}

function initializeProductData() {
    if (!localStorage.getItem(STORAGE_PRODUCTS_KEY)) {
        saveProducts(products);
    }
}
// ==================== LOCAL STORAGE FUNCTIONS ====================

// Users
function getAllUsers() {
    const users = localStorage.getItem('users');
    return users ? JSON.parse(users) : [];
}

function saveUser(user) {
    const users = getAllUsers();
    const existingUser = users.find(u => u.email === user.email);
    
    if (!existingUser) {
        users.push(user);
        localStorage.setItem('users', JSON.stringify(users));
        return true;
    }
    return false;
}

function findUserByEmail(email) {
    const users = getAllUsers();
    return users.find(u => u.email === email);
}

function saveCurrentUser(user) {
    const users = getAllUsers();
    const index = users.findIndex(u => u.email === user.email);
    if (index !== -1) {
        users[index] = user;
        localStorage.setItem('users', JSON.stringify(users));
    }
    localStorage.setItem('currentUser', JSON.stringify(user));
}

function getCurrentUser() {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
}

function isLoggedIn() {
    return getCurrentUser() !== null;
}

function getEmailSubscribers() {
    const subs = localStorage.getItem('emailSubscribers');
    return subs ? JSON.parse(subs) : [];
}

function saveEmailSubscriber(email) {
    if (!email) return null;
    const normalized = email.trim().toLowerCase();
    const subscribers = getEmailSubscribers();
    if (!subscribers.includes(normalized)) {
        subscribers.push(normalized);
        localStorage.setItem('emailSubscribers', JSON.stringify(subscribers));
    }
    return normalized;
}

function isEmailSubscriber(email) {
    if (!email) return false;
    return getEmailSubscribers().includes(email.trim().toLowerCase());
}

function getCustomerOrderCount(email) {
    if (!email) return 0;
    const normalizedEmail = email.trim().toLowerCase();
    return getAllOrders().filter(order => {
        const orderEmail = (order.userEmail || order.email || '').trim().toLowerCase();
        return orderEmail === normalizedEmail;
    }).length;
}

function getCustomerTotalPurchasedQuantity(email) {
    if (!email) return 0;
    const normalizedEmail = email.trim().toLowerCase();
    return getAllOrders()
        .filter(order => {
            const orderEmail = (order.userEmail || order.email || '').trim().toLowerCase();
            return orderEmail === normalizedEmail;
        })
        .reduce((sum, order) => sum + order.items.reduce((sub, item) => sub + item.quantity, 0), 0);
}

function getRecommendedCustomerDiscountCode(email) {
    if (!email) return null;
    const orderCount = getCustomerOrderCount(email);
    const totalPurchasedQuantity = getCustomerTotalPurchasedQuantity(email);
    if (orderCount >= 1 && totalPurchasedQuantity > 5) {
        return 'LOYAL10';
    }
    return 'EMAIL10';
}

// Cart
function getCart() {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function addToCart(productId, quantity = 1) {
    const normalizedProductId = String(productId);
    const cart = getCart();
    const existing = cart.find(item => String(item.productId) === normalizedProductId);
    
    if (existing) {
        existing.quantity += quantity;
    } else {
        cart.push({ productId: normalizedProductId, quantity });
    }
    
    saveCart(cart);
}

function removeFromCartItem(productId) {
    const normalizedProductId = String(productId);
    let cart = getCart();
    cart = cart.filter(item => String(item.productId) !== normalizedProductId);
    saveCart(cart);
}

function updateCartQuantity(productId, change) {
    const normalizedProductId = String(productId);
    const cart = getCart();
    const item = cart.find(i => String(i.productId) === normalizedProductId);
    
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCartItem(productId);
        } else {
            saveCart(cart);
        }
    }
}

function clearCart() {
    localStorage.setItem('cart', JSON.stringify([]));
}

// Orders
function getAllOrders() {
    const orders = localStorage.getItem('orders');
    return orders ? JSON.parse(orders) : [];
}

function saveOrder(order) {
    const orders = getAllOrders();
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
}

function saveAllOrders(orders) {
    localStorage.setItem('orders', JSON.stringify(orders));
}

function getUserOrders() {
    if (!isLoggedIn()) return [];
    
    const currentUser = getCurrentUser();
    const allOrders = getAllOrders();
    return allOrders.filter(order => order.userEmail === currentUser.email);
}

function createOrder(fullname, phone, address, email, paymentMethod, cartItems, discountCode = '', discountAmount = 0) {
    const orderDate = new Date();
    const estimatedDelivery = new Date(orderDate);
    estimatedDelivery.setDate(estimatedDelivery.getDate() + 4);
    const baseTotal = calculateOrderTotal(cartItems);
    const total = Math.max(0, baseTotal - (discountAmount || 0));
    const normalizedEmail = email.trim().toLowerCase();

    const order = {
        id: 'ORD-' + Date.now(),
        date: orderDate.toISOString(),
        userEmail: getCurrentUser()?.email?.trim().toLowerCase() || normalizedEmail,
        fullname,
        phone,
        shippingAddress: address,
        email: normalizedEmail,
        paymentMethod,
        items: cartItems,
        status: 'processing',
        estimatedDeliveryDate: estimatedDelivery.toISOString(),
        discountCode: discountCode ? discountCode.toUpperCase() : '',
        discountAmount: discountAmount || 0,
        total
    };
    
    saveOrder(order);
    updateProductSales(cartItems);
    return order;
}

function updateProductSales(cartItems) {
    const products = getAllProducts();
    cartItems.forEach(item => {
        const product = products.find(p => p.id === item.productId);
        if (product) {
            product.sold = (product.sold || 0) + item.quantity;
        }
    });
    saveProducts(products);
}

function getOrderStatusLabel(status) {
    const labels = {
        'pending': 'Chờ xác nhận',
        'processing': 'Đang xử lý',
        'shipped': 'Đã gửi',
        'delivered': 'Đã giao',
        'cancelled': 'Đã hủy'
    };
    return labels[status] || 'Đang chờ';
}

function getOrderStatusMessage(order) {
    const deliveryDate = getOrderDeliveryDate(order);
    const displayDate = deliveryDate ? formatDateString(deliveryDate) : 'đang xử lý';
    const messages = {
        'pending': `Đơn hàng đang chờ xác nhận. Dự kiến giao vào khoảng ${displayDate}.`, 
        'processing': `Đơn hàng đang được chuẩn bị. Dự kiến giao vào khoảng ${displayDate}.`,
        'shipped': `Đơn hàng đã rời kho và đang giao đến bạn. Dự kiến giao vào khoảng ${displayDate}.`,
        'delivered': `Đơn hàng đã giao vào khoảng ${displayDate}.`, 
        'cancelled': 'Đơn hàng đã bị hủy.'
    };
    return messages[order.status] || `Đơn hàng đang cập nhật. Dự kiến giao vào khoảng ${displayDate}.`;
}

function getOrderDeliveryDate(order) {
    if (order.estimatedDeliveryDate) {
        return order.estimatedDeliveryDate;
    }
    if (order.date) {
        const estimated = new Date(order.date);
        estimated.setDate(estimated.getDate() + 4);
        return estimated.toISOString();
    }
    return null;
}

function formatDateString(dateString) {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('vi-VN');
}

function isAdmin() {
    const user = getCurrentUser();
    return user && user.role === 'admin';
}

function getAllActivityLogs() {
    const logs = localStorage.getItem(STORAGE_ACTIVITY_KEY);
    return logs ? JSON.parse(logs) : [];
}

function saveActivityLogs(logs) {
    localStorage.setItem(STORAGE_ACTIVITY_KEY, JSON.stringify(logs));
}

function logUserActivity(action) {
    const currentUser = getCurrentUser();
    const logs = getAllActivityLogs();
    const newLog = {
        id: 'ACT-' + Date.now(),
        userEmail: currentUser?.email || 'guest',
        fullname: currentUser?.fullname || 'Khách',
        action,
        page: window.location.pathname,
        duration: 0,
        createdAt: new Date().toISOString()
    };
    logs.push(newLog);
    saveActivityLogs(logs);
    sessionStorage.setItem('currentActivityId', newLog.id);
    sessionStorage.setItem('sessionStart', new Date().toISOString());
}

function setupActivityTracking() {
    if (!sessionStorage.getItem('sessionStart')) {
        sessionStorage.setItem('sessionStart', new Date().toISOString());
    }
    window.addEventListener('beforeunload', recordActivitySession);
}

function recordActivitySession() {
    const start = sessionStorage.getItem('sessionStart');
    const activityId = sessionStorage.getItem('currentActivityId');
    if (!start || !activityId) return;

    const durationSeconds = Math.max(1, Math.round((new Date() - new Date(start)) / 1000));
    const logs = getAllActivityLogs();
    const activity = logs.find(entry => entry.id === activityId);
    if (activity) {
        activity.duration = (activity.duration || 0) + durationSeconds;
        saveActivityLogs(logs);
    }
    sessionStorage.removeItem('sessionStart');
    sessionStorage.removeItem('currentActivityId');
}

function getActivitySummary() {
    const logs = getAllActivityLogs();
    const totalTime = logs.reduce((sum, log) => sum + (log.duration || 0), 0);
    const uniqueUsers = new Set(logs.map(log => log.userEmail)).size;
    const sessions = logs.length;
    return { logs, totalTime, uniqueUsers, sessions };
}

function getSalesSummary() {
    const orders = getAllOrders().filter(order => order.status !== 'cancelled');
    const today = new Date();
    const salesToday = orders
        .filter(order => new Date(order.date).toLocaleDateString() === today.toLocaleDateString())
        .reduce((sum, order) => sum + order.total, 0);
    const salesThisMonth = orders
        .filter(order => {
            const date = new Date(order.date);
            return date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
        })
        .reduce((sum, order) => sum + order.total, 0);
    const salesThisYear = orders
        .filter(order => new Date(order.date).getFullYear() === today.getFullYear())
        .reduce((sum, order) => sum + order.total, 0);
    return { salesToday, salesThisMonth, salesThisYear };
}

function getSalesByCategory() {
    const orders = getAllOrders().filter(order => order.status !== 'cancelled');
    const categoryTotals = {};
    orders.forEach(order => {
        order.items.forEach(item => {
            const product = getProductById(item.productId);
            if (!product) return;
            categoryTotals[product.category] = (categoryTotals[product.category] || 0) + product.price * item.quantity;
        });
    });
    return categoryTotals;
}

function getRepeatPurchaseRate() {
    const orders = getAllOrders();
    const customerOrders = {};
    orders.forEach(order => {
        if (!customerOrders[order.userEmail]) customerOrders[order.userEmail] = 0;
        customerOrders[order.userEmail] += 1;
    });
    const customers = Object.keys(customerOrders);
    if (customers.length === 0) return 0;
    const repeaters = customers.filter(email => customerOrders[email] > 1).length;
    return Math.round((repeaters / customers.length) * 100);
}

function getCustomerSatisfactionRate() {
    const ratings = getAllProducts().map(product => product.rating || 0);
    if (ratings.length === 0) return 0;
    const averageRating = ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
    return Math.round((averageRating / 5) * 100);
}

function getProfitEstimate() {
    const orders = getAllOrders().filter(order => order.status !== 'cancelled');
    const revenue = orders.reduce((sum, order) => sum + order.total, 0);
    return Math.round(revenue * 0.3);
}

function getLowInteractionProducts(threshold = 180) {
    return getAllProducts()
        .filter(product => product.sold < threshold)
        .sort((a, b) => a.sold - b.sold)
        .slice(0, 5);
}

function getTopSellingProducts(count = 5) {
    return getAllProducts()
        .sort((a, b) => b.sold - a.sold)
        .slice(0, count);
}

function getAdminChatMessages() {
    const messages = localStorage.getItem(STORAGE_CHAT_KEY);
    return messages ? JSON.parse(messages) : [];
}

function saveAdminChatMessage(message) {
    const messages = getAdminChatMessages();
    messages.push(message);
    localStorage.setItem(STORAGE_CHAT_KEY, JSON.stringify(messages));
}

function calculateOrderTotal(cartItems) {
    let subtotal = 0;
    cartItems.forEach(item => {
        const product = getProductById(item.productId);
        if (product) {
            subtotal += product.price * item.quantity;
        }
    });
    
    const shipping = subtotal > 500000 ? 0 : 50000;
    const tax = subtotal * 0.1;
    return subtotal + shipping + tax;
}

function calculateCartSubtotal(cartItems) {
    return cartItems.reduce((sum, item) => {
        const product = getProductById(item.productId);
        return product ? sum + product.price * item.quantity : sum;
    }, 0);
}

function hasUsedDiscountCode(email, code) {
    if (!email || !code) return false;
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedCode = code.trim().toUpperCase();
    return getAllOrders().some(order => {
        const orderEmail = (order.userEmail || order.email || '').trim().toLowerCase();
        return orderEmail === normalizedEmail && order.discountCode === normalizedCode;
    });
}

function getDiscountInfo(code, subtotal, shipping, tax, email = '') {
    const normalized = code.trim().toUpperCase();
    const coupons = {
        'VIP10': { type: 'percent', value: 10, description: 'Giảm 10% cho đơn hàng VIP' },
        'EMAIL10': { type: 'percent', value: 10, description: 'Giảm 10% cho khách hàng đăng ký email' },
        'LOYAL10': { type: 'percent', value: 10, description: 'Giảm 10% cho khách hàng thân thiết mua 5+ sản phẩm' },
        'FASHION50': { type: 'fixed', value: 50000, description: 'Giảm 50.000đ' },
        'FREESHIP': { type: 'shipping', value: 0, description: 'Miễn phí vận chuyển' },
        'TREND15': { type: 'percent', value: 15, description: 'Giảm 15% cho đơn hàng thời thượng' }
    };
    const coupon = coupons[normalized];
    if (!coupon) {
        return { valid: false, amount: 0, description: '' };
    }

    if (normalized === 'EMAIL10' && email) {
        if (hasUsedDiscountCode(email, normalized)) {
            return { valid: false, amount: 0, description: 'Mã EMAIL10 đã được sử dụng. Hiệu lực chỉ 1 lần cho mỗi email.' };
        }
    }

    const totalBeforeDiscount = subtotal + shipping + tax;
    let amount = 0;
    if (coupon.type === 'percent') {
        amount = Math.round((totalBeforeDiscount * coupon.value) / 100);
    } else if (coupon.type === 'fixed') {
        amount = coupon.value;
    } else if (coupon.type === 'shipping') {
        amount = shipping;
    }
    return { valid: true, amount: Math.min(amount, totalBeforeDiscount), description: coupon.description };
}

// ==================== AUTHENTICATION FUNCTIONS ====================

function register(fullname, phone, address, email, password) {
    if (findUserByEmail(email)) {
        return false;
    }
    
    const user = {
        id: 'USR-' + Date.now(),
        fullname,
        phone,
        address,
        email,
        password, // In production, this should be hashed
        role: 'customer',
        createdAt: new Date().toISOString()
    };
    
    return saveUser(user);
}

function login(email, password) {
    const user = findUserByEmail(email);
    
    if (user && user.password === password) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        return true;
    }
    
    return false;
}

function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

function verifyPassword(email, password) {
    const user = findUserByEmail(email);
    return user && user.password === password;
}

// ==================== PRODUCT FUNCTIONS ====================

function getProductById(id) {
    const normalizedId = String(id).trim();
    return getAllProducts().find(p => {
        const productId = String(p.id).trim();
        return productId === normalizedId || Number(productId) === Number(normalizedId);
    });
}

function getAllProducts() {
    return getStoredProducts();
}

async function syncProductsFromServer() {
    try {
        const res = await fetch(`${API_BASE}/api/products`);
        if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data) && data.length) {
                saveProducts(data);
            }
        }
    } catch (err) {
        console.warn('Không thể đồng bộ sản phẩm từ server:', err);
    }
}

function filterProducts(searchTerm = '', category = '') {
    return getAllProducts().filter(product => {
        const matchSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchCategory = category === '' || product.category === category;
        
        return matchSearch && matchCategory;
    });
}

function getNewestProducts(count = 6) {
    return [...getAllProducts()]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, count);
}

function getBestSellingProducts(count = 6) {
    return [...getAllProducts()]
        .sort((a, b) => b.sold - a.sold)
        .slice(0, count);
}

function getQueryParam(name) {
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
}

function saveBuyNowItem(item) {
    sessionStorage.setItem('buyNowItem', JSON.stringify(item));
}

function getBuyNowItem() {
    const item = sessionStorage.getItem('buyNowItem');
    return item ? JSON.parse(item) : null;
}

function clearBuyNowItem() {
    sessionStorage.removeItem('buyNowItem');
}

function setBuyNow(productId, quantity = 1) {
    saveBuyNowItem({ productId, quantity });
    window.location.href = 'checkout.html';
}

function loadProductDetail() {
    const productId = getQueryParam('id');
    const editMode = getQueryParam('edit') === '1';
    const container = document.getElementById('productDetailContainer');
    if (!container || !productId) {
        if (container) {
            container.innerHTML = '<div class="empty-message">Không tìm thấy sản phẩm. <a href="index.html">Quay lại</a></div>';
        }
        return;
    }

    const product = getProductById(productId);
    if (!product) {
        container.innerHTML = '<div class="empty-message">Sản phẩm không tồn tại. <a href="index.html">Quay lại</a></div>';
        return;
    }

    if (editMode && isAdmin()) {
        container.innerHTML = `
            <section class="product-edit-hero premium-panel">
                <div class="hero-badge">VIP PRO EDIT</div>
                <div class="hero-content">
                    <span class="hero-label">Sản phẩm cao cấp</span>
                    <h1>Chỉnh sửa sản phẩm siêu chuyên nghiệp</h1>
                    <p>Điều chỉnh nhanh tên, giá và ảnh với giao diện trực quan, chuẩn brand N&L Shop.</p>
                </div>
                <div class="hero-meta">
                    <div><strong>Mã sản phẩm:</strong> ${product.id}</div>
                    <div><strong>Danh mục:</strong> ${product.category}</div>
                    <div><strong>Trạng thái:</strong> <span class="status-badge status-premium">VIP Ready</span></div>
                </div>
            </section>
            <section class="product-detail-card premium-card">
                <div class="product-detail-image">${renderProductImage(product.image)}</div>
                <div class="product-detail-info premium-info">
                    <div class="product-detail-category">${product.category}</div>
                    <h2>${product.name}</h2>
                    <p class="product-detail-description">${product.description}</p>
                    <div class="product-detail-price">${product.price.toLocaleString()}đ</div>
                    <div class="product-detail-rating">⭐ ${product.rating} · Đã bán ${product.sold || 0}</div>
                </div>
            </section>
            <form id="editProductForm" class="product-edit-form premium-edit-form">
                <div class="edit-form-grid">
                    <div class="edit-form-column">
                        <div class="form-row">
                            <label for="editProductName">Tên sản phẩm</label>
                            <input id="editProductName" type="text" value="${escapeHtml(product.name)}" required>
                        </div>
                        <div class="form-row">
                            <label for="editProductPrice">Giá sản phẩm (VND)</label>
                            <input id="editProductPrice" type="number" min="0" value="${product.price}" required>
                        </div>
                        <div class="form-row">
                            <label for="editProductImageInput">Ảnh sản phẩm (URL hoặc emoji)</label>
                            <input id="editProductImageInput" type="text" value="${escapeHtml(product.image)}">
                        </div>
                        <div class="form-row">
                            <label for="editProductImageFile">Hoặc chọn ảnh từ máy</label>
                            <input id="editProductImageFile" type="file" accept="image/*">
                        </div>
                    </div>
                    <div class="edit-form-column preview-column">
                        <div class="preview-title">Xem trước ảnh</div>
                        <div id="editImagePreview" class="image-preview large-preview">${renderProductImage(product.image)}</div>
                        <div class="preview-notes">Ảnh upload sẽ tự động chuyển sang định dạng Base64 để lưu cục bộ. Bạn cũng có thể dùng emoji để giữ phong cách gọn nhẹ.</div>
                    </div>
                </div>
                <div class="form-actions form-actions-right">
                    <button type="button" class="btn btn-primary btn-wide" onclick="saveProductEdit('${product.id}')">Lưu thay đổi</button>
                    <button type="button" class="btn btn-secondary btn-wide" onclick="window.location.href='product.html?id=${encodeURIComponent(product.id)}'">Hủy</button>
                </div>
            </form>
        `;
        setupProductEditForm();
        return;
    }

    container.innerHTML = `
        <div class="product-detail-card">
            <div class="product-detail-image">${renderProductImage(product.image)}</div>
            <div class="product-detail-info">
                <div class="product-detail-category">${product.category}</div>
                <h2>${product.name}</h2>
                <div class="product-detail-rating">⭐ ${product.rating} · Đã bán ${product.sold || 0}</div>
                <p class="product-detail-description">${product.description}</p>
                <div class="product-detail-price">${product.price.toLocaleString()}đ</div>
                <div class="quantity-control">
                    <button type="button" onclick="updateDetailQuantity(-1)">-</button>
                    <input type="number" id="detailQuantity" value="1" min="1">
                    <button type="button" onclick="updateDetailQuantity(1)">+</button>
                </div>
                <div class="product-detail-actions">
                    <button class="btn btn-secondary" onclick="addProductDetailToCart()">Thêm vào giỏ</button>
                    <button class="btn btn-primary" onclick="setBuyNow('${product.id}', Number(document.getElementById('detailQuantity').value))">Thanh toán ngay</button>
                </div>
            </div>
        </div>
    `;
}

function setupProductEditForm() {
    const fileInput = document.getElementById('editProductImageFile');
    const imageInput = document.getElementById('editProductImageInput');
    const preview = document.getElementById('editImagePreview');

    if (fileInput) {
        fileInput.addEventListener('change', event => {
            const file = event.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = () => {
                if (imageInput) {
                    imageInput.value = reader.result;
                }
                if (preview) {
                    preview.innerHTML = renderProductImage(reader.result);
                }
            };
            reader.readAsDataURL(file);
        });
    }

    if (imageInput && preview) {
        imageInput.addEventListener('input', () => {
            preview.innerHTML = renderProductImage(imageInput.value.trim());
        });
    }
}

function saveProductEdit(productId) {
    const nameInput = document.getElementById('editProductName');
    const priceInput = document.getElementById('editProductPrice');
    const imageInput = document.getElementById('editProductImageInput');

    if (!nameInput || !priceInput || !imageInput) {
        return;
    }

    const name = nameInput.value.trim();
    const price = Number(priceInput.value);
    const image = imageInput.value.trim();

    if (!name || Number.isNaN(price) || price < 0) {
        alert('Vui lòng nhập đầy đủ tên và giá sản phẩm hợp lệ.');
        return;
    }

    const products = getAllProducts();
    const index = products.findIndex(product => product.id === productId);
    if (index === -1) {
        alert('Không tìm thấy sản phẩm để lưu.');
        return;
    }

    products[index] = {
        ...products[index],
        name,
        price,
        image: image || products[index].image,
    };

    saveProducts(products);
    alert('Đã lưu thay đổi sản phẩm.');
    window.location.href = 'product.html?id=' + encodeURIComponent(productId);
}

function viewProduct(productId) {
    window.location.href = 'product.html?id=' + encodeURIComponent(productId);
}

function updateDetailQuantity(change) {
    const quantityInput = document.getElementById('detailQuantity');
    if (!quantityInput) return;
    const current = Number(quantityInput.value) || 1;
    const next = Math.max(1, current + change);
    quantityInput.value = next;
}

// khởi tạo dữ liệu cục bộ và cố gắng đồng bộ với backend nếu có
initializeProductData();
syncProductsFromServer();

function addProductDetailToCart() {
    const productId = getQueryParam('id');
    const quantity = Number(document.getElementById('detailQuantity')?.value) || 1;
    if (!productId) return;
    addToCart(productId, quantity);
    updateCartCount();
    alert('Đã thêm vào giỏ hàng: ' + quantity + ' sản phẩm');
}

function getUserPurchaseHistory() {
    const orders = getUserOrders();
    const history = {};

    orders.forEach(order => {
        order.items.forEach(item => {
            const product = getProductById(item.productId);
            if (!product) return;

            if (!history[item.productId]) {
                history[item.productId] = {
                    product,
                    quantity: 0,
                    total: 0,
                    lastDate: order.date,
                    orders: []
                };
            }

            history[item.productId].quantity += item.quantity;
            history[item.productId].total += product.price * item.quantity;
            if (new Date(order.date) > new Date(history[item.productId].lastDate)) {
                history[item.productId].lastDate = order.date;
            }
            history[item.productId].orders.push({
                orderId: order.id,
                quantity: item.quantity,
                date: order.date
            });
        });
    });

    return Object.values(history).sort((a, b) => b.quantity - a.quantity);
}

// ==================== UI FUNCTIONS ====================

function initializePage() {
    initializeProductData();
    updateUserDisplay();
    updateCartCount();
    setupUserMenu();
    setupActivityTracking();
    if (typeof document !== 'undefined') {
        logUserActivity('Truy cập trang: ' + document.title);
    }
}

function setupUserMenu() {
    const userMenu = document.querySelector('.user-menu');
    const userDisplay = document.getElementById('userDisplay');
    if (!userMenu || !userDisplay) return;

    userDisplay.addEventListener('click', function(event) {
        if (isLoggedIn()) {
            event.preventDefault();
            userMenu.classList.toggle('dropdown-open');
        }
    });

    document.addEventListener('click', function(event) {
        if (!userMenu.contains(event.target)) {
            userMenu.classList.remove('dropdown-open');
        }
    });
}

function updateUserDisplay() {
    const userDisplay = document.getElementById('userDisplay');
    const userMenu = userDisplay ? userDisplay.closest('.user-menu') : null;
    const accountLink = document.getElementById('accountLink');
    const ordersLink = document.getElementById('ordersLink');
    const historyLink = document.getElementById('historyLink');
    const logoutBtn = document.getElementById('logoutBtn');
    const loginLink = document.getElementById('loginLink');
    const registerLink = document.getElementById('registerLink');
    
    if (isLoggedIn()) {
        const user = getCurrentUser();
        userDisplay.textContent = user.fullname || user.email;
        userDisplay.href = 'account.html';
        userMenu.classList.add('logged-in');
        
        if (accountLink) accountLink.style.display = 'block';
        if (ordersLink) ordersLink.style.display = 'block';
        if (historyLink) historyLink.style.display = 'block';
        if (isAdmin() && document.getElementById('adminLink')) {
            document.getElementById('adminLink').style.display = 'block';
        }
        if (logoutBtn) logoutBtn.style.display = 'block';
        if (loginLink) loginLink.style.display = 'none';
        if (registerLink) registerLink.style.display = 'none';
    } else {
        userDisplay.textContent = '👤 Đăng nhập';
        userDisplay.href = 'login.html';
        userMenu.classList.remove('logged-in');
        if (accountLink) accountLink.style.display = 'none';
        if (ordersLink) ordersLink.style.display = 'none';
        if (historyLink) historyLink.style.display = 'none';
        if (document.getElementById('adminLink')) {
            document.getElementById('adminLink').style.display = 'none';
        }
        if (logoutBtn) logoutBtn.style.display = 'none';
        if (loginLink) loginLink.style.display = 'block';
        if (registerLink) registerLink.style.display = 'block';
    }
}

function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        cartCount.textContent = getCart().length;
    }
}

function loadProducts(searchTerm = '', category = '') {
    const container = document.getElementById('productsContainer');
    if (!container) return;
    
    const filteredProducts = filterProducts(searchTerm, category);
    container.innerHTML = '';
    
    if (filteredProducts.length === 0) {
        container.innerHTML = '<div class="empty-message">Không tìm thấy sản phẩm nào</div>';
        return;
    }
    
    filteredProducts.forEach(product => {
        const card = createProductCard(product);
        container.appendChild(card);
    });
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    
    const stars = '⭐'.repeat(Math.floor(product.rating)) + (product.rating % 1 ? '½' : '');
    const salesInfo = product.sold ? `<div class="product-meta">Đã bán ${product.sold}</div>` : '';
    
    card.innerHTML = `
        <div class="product-image">${renderProductImage(product.image)}</div>
        <div class="product-info">
            <div class="product-name">${product.name}</div>
            <div class="product-category">${product.category}</div>
            <div class="product-rating">${stars} ${product.rating}</div>
            ${salesInfo}
            <div class="product-price">${product.price.toLocaleString()}đ</div>
            <div class="product-actions">
                <button class="btn btn-secondary" onclick="viewProduct('${product.id}')">Xem chi tiết</button>
                <button class="btn btn-primary" onclick="quickAdd('${product.id}')">Thêm vào giỏ</button>
            </div>
        </div>
    `;
    
    return card;
}

function renderProductImage(image) {
    const value = String(image || '').trim();
    if (!value) return '';
    const isUrl = value.startsWith('http://') || value.startsWith('https://') || value.startsWith('data:image/');
    if (isUrl) {
        return `<img class="product-image-preview" src="${escapeHtml(value)}" alt="Ảnh sản phẩm">`;
    }
    return escapeHtml(value);
}

function escapeHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function viewProduct(productId) {
    window.location.href = 'product.html?id=' + encodeURIComponent(productId);
}

function quickAdd(productId) {
    const product = getProductById(productId);
    if (product) {
        addToCart(productId);
        updateCartCount();
        alert(`${product.name} đã được thêm vào giỏ hàng!`);
    }
}

function setupSearchAndFilter() {
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    
    if (!searchInput || !categoryFilter) return;
    
    function updateProducts() {
        const searchTerm = searchInput.value;
        const category = categoryFilter.value;
        loadProducts(searchTerm, category);
    }
    
    searchInput.addEventListener('input', updateProducts);
    categoryFilter.addEventListener('change', updateProducts);
}

// ==================== INITIALIZATION ====================

// Demo data initialization - Add some test data if not exists
function initializeDemoData() {
    initializeProductData();

    const users = getAllUsers();
    if (!users.some(user => user.role === 'admin')) {
        const adminUser = {
            id: 'admin-001',
            fullname: 'Quản trị viên',
            phone: '0987654321',
            address: 'Văn phòng N&L Shop',
            email: 'admin@fashionshop.com',
            password: 'admin123',
            role: 'admin',
            createdAt: new Date().toISOString()
        };
        saveUser(adminUser);
    }

    if (!users.some(user => user.email === 'demo@fashionshop.com')) {
        const demoUser = {
            id: 'demo-001',
            fullname: 'Người dùng Demo',
            phone: '0123456789',
            address: '123 Đường Ngô Quyền, Hà Nội',
            email: 'demo@fashionshop.com',
            password: '123456',
            role: 'customer',
            createdAt: new Date().toISOString()
        };
        saveUser(demoUser);
    }
    
    const orders = getAllOrders();
    if (orders.length === 0) {
        const demoOrder = {
            id: 'ORD-1001',
            date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            userEmail: 'demo@fashionshop.com',
            fullname: 'Người dùng Demo',
            phone: '0123456789',
            shippingAddress: '123 Đường Ngô Quyền, Hà Nội',
            email: 'demo@fashionshop.com',
            paymentMethod: 'cod',
            items: [
                { productId: '001', quantity: 1 },
                { productId: '004', quantity: 2 }
            ],
            status: 'delivered',
            total: 815000
        };
        saveOrder(demoOrder);
    }
}

// Initialize demo data on first load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeDemoData);
} else {
    initializeDemoData();
}
