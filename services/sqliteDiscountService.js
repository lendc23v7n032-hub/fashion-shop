const { db } = require('./db');

const DEFAULT_DISCOUNTS = [
  {
    code: 'WELCOME10',
    type: 'percent',
    value: 10,
    minOrder: 100000,
    maxDiscount: 50000,
    description: 'Giảm 10% cho đơn hàng từ 100,000đ (tối đa 50,000đ)',
    active: true,
    createdAt: '2024-01-01T00:00:00.000Z',
  },
  {
    code: 'SUMMER20',
    type: 'percent',
    value: 20,
    minOrder: 300000,
    maxDiscount: 100000,
    description: 'Giảm 20% cho đơn hàng từ 300,000đ (tối đa 100,000đ)',
    active: true,
    createdAt: '2024-06-01T00:00:00.000Z',
  },
  {
    code: 'VIP50',
    type: 'fixed',
    value: 50000,
    minOrder: 200000,
    maxDiscount: 50000,
    description: 'Giảm 50,000đ cho đơn hàng từ 200,000đ',
    active: true,
    createdAt: '2024-01-01T00:00:00.000Z',
  },
];

function normalizeDiscount(discount) {
  if (!discount) return discount;
  return {
    ...discount,
    active: Boolean(discount.active),
  };
}

async function initializeDiscounts() {
  const count = db.prepare('SELECT COUNT(*) AS count FROM discounts').get();
  if (count.count === 0) {
    const insert = db.prepare(
      `INSERT INTO discounts (code, type, value, minOrder, maxDiscount, description, active, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    );

    const insertMany = db.transaction((items) => {
      for (const discount of items) {
        insert.run(
          discount.code,
          discount.type,
          discount.value,
          discount.minOrder || 0,
          discount.maxDiscount || null,
          discount.description || null,
          discount.active ? 1 : 0,
          discount.createdAt || new Date().toISOString(),
          discount.updatedAt || null
        );
      }
    });

    insertMany(DEFAULT_DISCOUNTS);
    return DEFAULT_DISCOUNTS;
  }

  return db.prepare('SELECT * FROM discounts').all().map(normalizeDiscount);
}

async function getAllDiscounts() {
  return db.prepare('SELECT * FROM discounts').all().map(normalizeDiscount);
}

async function getDiscountByCode(code) {
  if (!code) return null;
  const row = db.prepare('SELECT * FROM discounts WHERE code = ?').get(code.toUpperCase());
  return normalizeDiscount(row);
}

async function createDiscount(discountData) {
  const existing = await getDiscountByCode(discountData.code);
  if (existing) {
    throw new Error('Mã giảm giá đã tồn tại');
  }

  const discount = {
    code: discountData.code.toUpperCase(),
    type: discountData.type || 'percent',
    value: discountData.value,
    minOrder: discountData.minOrder || 0,
    maxDiscount: discountData.maxDiscount || null,
    description: discountData.description || '',
    active: discountData.active !== false,
    createdAt: new Date().toISOString(),
    updatedAt: null,
  };

  db.prepare(
    `INSERT INTO discounts (code, type, value, minOrder, maxDiscount, description, active, createdAt, updatedAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    discount.code,
    discount.type,
    discount.value,
    discount.minOrder,
    discount.maxDiscount,
    discount.description,
    discount.active ? 1 : 0,
    discount.createdAt,
    discount.updatedAt
  );

  return discount;
}

async function updateDiscount(code, updates) {
  const existing = await getDiscountByCode(code);
  if (!existing) {
    throw new Error('Mã giảm giá không tồn tại');
  }

  const fields = [];
  const params = [];

  if (updates.type !== undefined) {
    fields.push('type = ?');
    params.push(updates.type);
  }
  if (updates.value !== undefined) {
    fields.push('value = ?');
    params.push(updates.value);
  }
  if (updates.minOrder !== undefined) {
    fields.push('minOrder = ?');
    params.push(updates.minOrder);
  }
  if (updates.maxDiscount !== undefined) {
    fields.push('maxDiscount = ?');
    params.push(updates.maxDiscount);
  }
  if (updates.description !== undefined) {
    fields.push('description = ?');
    params.push(updates.description);
  }
  if (updates.active !== undefined) {
    fields.push('active = ?');
    params.push(updates.active ? 1 : 0);
  }

  if (fields.length === 0) {
    return existing;
  }

  fields.push('updatedAt = ?');
  params.push(new Date().toISOString());
  params.push(code.toUpperCase());

  db.prepare(`UPDATE discounts SET ${fields.join(', ')} WHERE code = ?`).run(...params);
  return getDiscountByCode(code);
}

async function deleteDiscount(code) {
  const result = db.prepare('DELETE FROM discounts WHERE code = ?').run(code.toUpperCase());
  if (result.changes === 0) {
    throw new Error('Mã giảm giá không tồn tại');
  }
  return true;
}

module.exports = {
  initializeDiscounts,
  getAllDiscounts,
  getDiscountByCode,
  createDiscount,
  updateDiscount,
  deleteDiscount,
};