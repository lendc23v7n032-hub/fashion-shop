const path = require('path');
const fs = require('fs').promises;
const { db, init } = require('../services/db');

(async function migrate(){
  try {
    init();

    const dataDir = path.join(__dirname, '..', 'data');

    // Migrate products
    try {
      const productsRaw = await fs.readFile(path.join(dataDir, 'products.json'), 'utf8');
      const products = JSON.parse(productsRaw || '[]');
      const insert = db.prepare(`INSERT OR REPLACE INTO products (id,name,category,price,image,rating,sold,description,createdAt,updatedAt) VALUES (?,?,?,?,?,?,?,?,?,?)`);
      db.transaction(()=>{
        products.forEach(p => insert.run(p.id, p.name, p.category, p.price, p.image, p.rating || null, p.sold || 0, p.description || null, p.createdAt || new Date().toISOString(), p.updatedAt || null));
      })();
      console.log('Migrated products:', products.length);
    } catch (e) { console.warn('No products.json or failed to migrate:', e.message); }

    // Migrate discounts
    try {
      const discountsRaw = await fs.readFile(path.join(dataDir, 'discounts.json'), 'utf8');
      const discounts = JSON.parse(discountsRaw || '[]');
      const insertD = db.prepare(`INSERT OR REPLACE INTO discounts (code,type,value,minOrder,maxDiscount,description,active,createdAt,updatedAt) VALUES (?,?,?,?,?,?,?,?,?)`);
      db.transaction(()=>{
        discounts.forEach(d => insertD.run(d.code, d.type, d.value, d.minOrder || 0, d.maxDiscount || null, d.description || null, d.active ? 1 : 0, d.createdAt || new Date().toISOString(), d.updatedAt || null));
      })();
      console.log('Migrated discounts:', discounts.length);
    } catch (e) { console.warn('No discounts.json or failed to migrate:', e.message); }

    // Migrate users
    try {
      const usersRaw = await fs.readFile(path.join(dataDir, 'users.json'), 'utf8');
      const users = JSON.parse(usersRaw || '[]');
      const insertU = db.prepare(`INSERT OR REPLACE INTO users (id,email,password,role,createdAt,updatedAt) VALUES (?,?,?,?,?,?)`);
      db.transaction(()=>{
        users.forEach(u => insertU.run(u.id, u.email, u.password || null, u.role || 'user', u.createdAt || new Date().toISOString(), u.updatedAt || null));
      })();
      console.log('Migrated users:', users.length);
    } catch (e) { console.warn('No users.json or failed to migrate:', e.message); }

    // Migrate orders
    try {
      const ordersRaw = await fs.readFile(path.join(dataDir, 'orders.json'), 'utf8');
      const orders = JSON.parse(ordersRaw || '[]');
      const insertO = db.prepare(`INSERT OR REPLACE INTO orders (id,date,fullname,phone,address,email,paymentMethod,items,discountCode,status,subtotal,shipping,tax,discountAmount,total,createdAt,updatedAt) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`);
      db.transaction(()=>{
        orders.forEach(o => insertO.run(o.id, o.date || null, o.fullname || null, o.phone || null, o.address || null, o.email || null, o.paymentMethod || null, JSON.stringify(o.items || []), o.discountCode || null, o.status || null, o.subtotal || null, o.shipping || null, o.tax || null, o.discountAmount || null, o.total || null, o.createdAt || new Date().toISOString(), o.updatedAt || null));
      })();
      console.log('Migrated orders:', orders.length);
    } catch (e) { console.warn('No orders.json or failed to migrate:', e.message); }

    console.log('Migration complete. DB file at:', path.join(__dirname, '..', 'data', 'app.db'));
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
})();
