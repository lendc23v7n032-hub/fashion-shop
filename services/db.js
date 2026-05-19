const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, '..', 'data', 'app.db');
fs.mkdirSync(path.dirname(dbPath), { recursive: true });

const db = new Database(dbPath);

function init() {
  db.exec(`
    PRAGMA foreign_keys = ON;
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT,
      price INTEGER,
      image TEXT,
      rating REAL,
      sold INTEGER DEFAULT 0,
      description TEXT,
      createdAt TEXT,
      updatedAt TEXT
    );

    CREATE TABLE IF NOT EXISTS discounts (
      code TEXT PRIMARY KEY,
      type TEXT,
      value REAL,
      minOrder INTEGER,
      maxDiscount INTEGER,
      description TEXT,
      active INTEGER,
      createdAt TEXT,
      updatedAt TEXT
    );

    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE,
      password TEXT,
      role TEXT,
      createdAt TEXT,
      updatedAt TEXT
    );

    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      date TEXT,
      fullname TEXT,
      phone TEXT,
      address TEXT,
      email TEXT,
      paymentMethod TEXT,
      items TEXT,
      discountCode TEXT,
      status TEXT,
      subtotal INTEGER,
      shipping INTEGER,
      tax INTEGER,
      discountAmount INTEGER,
      total INTEGER,
      createdAt TEXT,
      updatedAt TEXT,
      FOREIGN KEY(discountCode) REFERENCES discounts(code)
    );
  `);
}

module.exports = { db, init, dbPath };
