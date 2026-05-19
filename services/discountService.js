const sqliteDiscountService = require('./sqliteDiscountService');

async function initializeDiscounts() {
  return sqliteDiscountService.initializeDiscounts();
}

async function getAllDiscounts() {
  return sqliteDiscountService.getAllDiscounts();
}

async function getDiscountByCode(code) {
  return sqliteDiscountService.getDiscountByCode(code);
}

async function validateDiscount(code, subtotal) {
  if (!code) {
    return { valid: false, discount: 0 };
  }

  const discount = await getDiscountByCode(code);

  if (!discount) {
    return { valid: false, error: 'Mã giảm giá không tồn tại', discount: 0 };
  }

  if (!discount.active) {
    return { valid: false, error: 'Mã giảm giá đã hết hạn', discount: 0 };
  }

  if (subtotal < discount.minOrder) {
    return {
      valid: false,
      error: `Đơn hàng tối thiểu ${discount.minOrder.toLocaleString()}đ để sử dụng mã này`,
      discount: 0,
    };
  }

  let discountAmount;
  if (discount.type === 'percent') {
    discountAmount = Math.floor(subtotal * discount.value / 100);
    if (discount.maxDiscount) {
      discountAmount = Math.min(discountAmount, discount.maxDiscount);
    }
  } else {
    discountAmount = discount.value;
  }

  return {
    valid: true,
    discount: discountAmount,
    discountDetails: {
      code: discount.code,
      type: discount.type,
      value: discount.value,
      description: discount.description,
    },
  };
}

async function createDiscount(discountData) {
  return sqliteDiscountService.createDiscount(discountData);
}

async function updateDiscount(code, updates) {
  return sqliteDiscountService.updateDiscount(code, updates);
}

async function deleteDiscount(code) {
  return sqliteDiscountService.deleteDiscount(code);
}

module.exports = {
  initializeDiscounts,
  getAllDiscounts,
  getDiscountByCode,
  validateDiscount,
  createDiscount,
  updateDiscount,
  deleteDiscount,
};
