const { validateDiscount } = require('./discountService');

const FREE_SHIPPING_THRESHOLD = 500000;
const SHIPPING_COST = 50000;
const TAX_RATE = 0.1;

async function calculateTotals(items, products, discountCode = null) {
  const subtotal = items.reduce((sum, item) => {
    const product = products.find(p => String(p.id) === String(item.productId));
    if (!product) {
      throw new Error(`Sản phẩm không tồn tại: ${item.productId}`);
    }
    return sum + (product.price || 0) * (item.quantity || 0);
  }, 0);

  let discountAmount = 0;
  let discountDetails = null;

  if (discountCode) {
    const discountResult = await validateDiscount(discountCode, subtotal);
    if (!discountResult.valid) {
      throw new Error(discountResult.error);
    }
    discountAmount = discountResult.discount;
    discountDetails = discountResult.discountDetails;
  }

  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const tax = Math.round(subtotal * TAX_RATE);
  const total = Math.max(0, subtotal + shipping + tax - discountAmount);

  return {
    subtotal,
    shipping,
    tax,
    discountAmount,
    discountDetails,
    total,
  };
}

module.exports = {
  calculateTotals,
};
