/**
 * Purpose: Sample data for the Text-to-SQL workstation
 * Features: Provides sample schema and data for demonstration
 * Used in: Main workstation component
 */

import type { SchemaTable } from "../types"

export const sampleSchema: SchemaTable[] = [
  {
    name: "products",
    columns: [
      { name: "id", type: "INT", isPrimary: true },
      { name: "product_name", type: "VARCHAR(255)" },
      { name: "category", type: "VARCHAR(100)" },
      { name: "price", type: "DECIMAL(10,2)" },
      { name: "stock", type: "INT" },
      { name: "created_at", type: "TIMESTAMP" },
    ],
  },
  {
    name: "customers",
    columns: [
      { name: "id", type: "INT", isPrimary: true },
      { name: "first_name", type: "VARCHAR(100)" },
      { name: "last_name", type: "VARCHAR(100)" },
      { name: "email", type: "VARCHAR(255)" },
      { name: "region_id", type: "INT", isForeign: true, foreignTable: "regions", foreignColumn: "id" },
      { name: "created_at", type: "TIMESTAMP" },
    ],
  },
  {
    name: "orders",
    columns: [
      { name: "id", type: "INT", isPrimary: true },
      { name: "order_id", type: "VARCHAR(50)" },
      { name: "customer_id", type: "INT", isForeign: true, foreignTable: "customers", foreignColumn: "id" },
      { name: "product_id", type: "INT", isForeign: true, foreignTable: "products", foreignColumn: "id" },
      { name: "quantity", type: "INT" },
      { name: "unit_price", type: "DECIMAL(10,2)" },
      { name: "order_date", type: "DATE" },
      { name: "status", type: "VARCHAR(50)" },
    ],
  },
  {
    name: "regions",
    columns: [
      { name: "id", type: "INT", isPrimary: true },
      { name: "region_name", type: "VARCHAR(100)" },
      { name: "country", type: "VARCHAR(100)" },
    ],
  },
]

export const sampleData = {
  products: [
    { id: 1, product_name: "iPhone 13 Pro", category: "Electronics", price: 999.99, stock: 50 },
    { id: 2, product_name: 'MacBook Pro 16"', category: "Electronics", price: 2399.99, stock: 25 },
    { id: 3, product_name: "AirPods Pro", category: "Audio", price: 249.99, stock: 100 },
    { id: 4, product_name: "iPad Air", category: "Electronics", price: 599.99, stock: 75 },
    { id: 5, product_name: "Apple Watch Series 7", category: "Wearables", price: 399.99, stock: 60 },
    { id: 6, product_name: "Samsung Galaxy S22", category: "Electronics", price: 799.99, stock: 45 },
    { id: 7, product_name: "Sony WH-1000XM4", category: "Audio", price: 349.99, stock: 30 },
    { id: 8, product_name: "Dell XPS 15", category: "Electronics", price: 1799.99, stock: 20 },
    { id: 9, product_name: "Logitech MX Master 3", category: "Peripherals", price: 99.99, stock: 80 },
    { id: 10, product_name: 'LG OLED C1 65"', category: "TV & Home", price: 1999.99, stock: 15 },
  ],
}
