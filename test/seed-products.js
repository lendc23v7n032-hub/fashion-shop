const dotenv = require('dotenv');
const connectDB = require('../config/db');
const Product = require('../models/Product');

dotenv.config();

const products = [
  {
    name: 'Áo Phông Nam Cơ Bản',
    description: 'Áo phông nam cơ bản, thoải mái và bền',
    price: 150000,
    image: 'https://via.placeholder.com/300x400?text=T-Shirt',
    stock: 50,
    category: 'Áo',
  },
  {
    name: 'Quần Jean Nam Xanh',
    description: 'Quần jean nam màu xanh đậm, chất lượng cao',
    price: 450000,
    image: 'https://via.placeholder.com/300x400?text=Jeans',
    stock: 30,
    category: 'Quần',
  },
  {
    name: 'Giày Sneaker Trắng',
    description: 'Giày sneaker trắng sạch, phù hợp với nhiều trang phục',
    price: 850000,
    image: 'https://via.placeholder.com/300x400?text=Sneaker',
    stock: 25,
    category: 'Giày',
  },
  {
    name: 'Áo Khoác Dù Chống Nước',
    description: 'Áo khoác dù chống nước, thích hợp cho mọi mùa',
    price: 650000,
    image: 'https://via.placeholder.com/300x400?text=Jacket',
    stock: 20,
    category: 'Áo Khoác',
  },
  {
    name: 'Mũ Lưỡi Trai Đen',
    description: 'Mũ lưỡi trai đen, dễ dàng phối hợp với các trang phục',
    price: 180000,
    image: 'https://via.placeholder.com/300x400?text=Cap',
    stock: 40,
    category: 'Phụ Kiện',
  },
];

const run = async () => {
  try {
    await connectDB();
    const count = await Product.countDocuments();
    console.log(`Current product count: ${count}`);
    if (count > 0) {
      console.log('Products already exist. No seeding necessary.');
      process.exit(0);
    }

    await Product.insertMany(products);
    console.log(`Inserted ${products.length} products.`);
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed', error);
    process.exit(1);
  }
};

run();
