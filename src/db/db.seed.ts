import { db } from "./db";
import {
  productsTable,
  salesTable,
  customersTable,
  ordersTable,
  orderItemsTable,
  suppliersTable,
  inventoryLogsTable,
  analyticsTable,
  usersTable,
} from "./schema";

export async function seed() {
  console.log("🌱 Seeding database...");

  // PRODUCTS
  await db.insert(productsTable).values([
    { id: 1, name: "Laptop", category: "Electronics", price: 75000, stock: 10 },
    { id: 2, name: "Phone", category: "Electronics", price: 30000, stock: 25 },
    {
      id: 3,
      name: "Headphones",
      category: "Accessories",
      price: 2000,
      stock: 50,
    },
    {
      id: 4,
      name: "Keyboard",
      category: "Accessories",
      price: 1500,
      stock: 40,
    },
    {
      id: 5,
      name: "Monitor",
      category: "Electronics",
      price: 12000,
      stock: 15,
    },
    { id: 6, name: "Mouse", category: "Accessories", price: 800, stock: 100 },
    { id: 7, name: "Desk", category: "Furniture", price: 10000, stock: 20 },
    { id: 8, name: "Chair", category: "Furniture", price: 5000, stock: 30 },
    { id: 9, name: "Notebook", category: "Stationery", price: 50, stock: 500 },
    { id: 10, name: "Pen Set", category: "Stationery", price: 200, stock: 300 },
  ]);

  // CUSTOMERS
  await db.insert(customersTable).values([
    {
      id: 1,
      name: "Rahul Sharma",
      email: "rahul@gmail.com",
      phone: "9876543210",
      address: "Pune",
    },
    {
      id: 2,
      name: "Priya Singh",
      email: "priya@gmail.com",
      phone: "9123456780",
      address: "Mumbai",
    },
    {
      id: 3,
      name: "Amit Patel",
      email: "amit@gmail.com",
      phone: "9988776655",
      address: "Ahmedabad",
    },
    {
      id: 4,
      name: "Sneha Verma",
      email: "sneha@gmail.com",
      phone: "9000000001",
      address: "Delhi",
    },
    {
      id: 5,
      name: "Rohit Gupta",
      email: "rohit@gmail.com",
      phone: "9000000002",
      address: "Jaipur",
    },
    {
      id: 6,
      name: "Anjali Mehta",
      email: "anjali@gmail.com",
      phone: "9000000003",
      address: "Surat",
    },
    {
      id: 7,
      name: "Karan Shah",
      email: "karan@gmail.com",
      phone: "9000000004",
      address: "Indore",
    },
    {
      id: 8,
      name: "Neha Joshi",
      email: "neha@gmail.com",
      phone: "9000000005",
      address: "Nagpur",
    },
    {
      id: 9,
      name: "Vikas Yadav",
      email: "vikas@gmail.com",
      phone: "9000000006",
      address: "Lucknow",
    },
    {
      id: 10,
      name: "Pooja Nair",
      email: "pooja@gmail.com",
      phone: "9000000007",
      address: "Kochi",
    },
  ]);

  // ORDERS
  await db.insert(ordersTable).values([
    { id: 1, customer_id: 1, total_amount: 77000, status: "completed" },
    { id: 2, customer_id: 2, total_amount: 32000, status: "completed" },
    { id: 3, customer_id: 3, total_amount: 1500, status: "pending" },
    { id: 4, customer_id: 4, total_amount: 2000, status: "completed" },
    { id: 5, customer_id: 5, total_amount: 12000, status: "completed" },
    { id: 6, customer_id: 6, total_amount: 800, status: "pending" },
    { id: 7, customer_id: 7, total_amount: 5000, status: "completed" },
    { id: 8, customer_id: 8, total_amount: 10000, status: "completed" },
    { id: 9, customer_id: 9, total_amount: 200, status: "pending" },
    { id: 10, customer_id: 10, total_amount: 50, status: "completed" },
  ]);

  // ORDER ITEMS
  await db.insert(orderItemsTable).values([
    { order_id: 1, product_id: 1, quantity: 1, price: 75000 },
    { order_id: 1, product_id: 3, quantity: 1, price: 2000 },
    { order_id: 2, product_id: 2, quantity: 1, price: 30000 },
    { order_id: 3, product_id: 4, quantity: 1, price: 1500 },
    { order_id: 4, product_id: 3, quantity: 1, price: 2000 },
    { order_id: 5, product_id: 5, quantity: 1, price: 12000 },
    { order_id: 6, product_id: 6, quantity: 1, price: 800 },
    { order_id: 7, product_id: 8, quantity: 1, price: 5000 },
    { order_id: 8, product_id: 7, quantity: 1, price: 10000 },
    { order_id: 9, product_id: 10, quantity: 1, price: 200 },
  ]);

  // SALES
  await db.insert(salesTable).values([
    {
      product_id: 1,
      quantity: 1,
      total_amount: 75000,
      customer_name: "Rahul Sharma",
      region: "Pune",
    },
    {
      product_id: 2,
      quantity: 1,
      total_amount: 30000,
      customer_name: "Priya Singh",
      region: "Mumbai",
    },
    {
      product_id: 3,
      quantity: 2,
      total_amount: 4000,
      customer_name: "Amit Patel",
      region: "Ahmedabad",
    },
    {
      product_id: 4,
      quantity: 1,
      total_amount: 1500,
      customer_name: "Sneha Verma",
      region: "Delhi",
    },
    {
      product_id: 5,
      quantity: 1,
      total_amount: 12000,
      customer_name: "Rohit Gupta",
      region: "Jaipur",
    },
    {
      product_id: 6,
      quantity: 2,
      total_amount: 1600,
      customer_name: "Anjali Mehta",
      region: "Surat",
    },
    {
      product_id: 7,
      quantity: 1,
      total_amount: 10000,
      customer_name: "Karan Shah",
      region: "Indore",
    },
    {
      product_id: 8,
      quantity: 1,
      total_amount: 5000,
      customer_name: "Neha Joshi",
      region: "Nagpur",
    },
    {
      product_id: 9,
      quantity: 5,
      total_amount: 250,
      customer_name: "Vikas Yadav",
      region: "Lucknow",
    },
    {
      product_id: 10,
      quantity: 2,
      total_amount: 400,
      customer_name: "Pooja Nair",
      region: "Kochi",
    },
  ]);

  // SUPPLIERS
  await db.insert(suppliersTable).values([
    {
      name: "Tech Distributors",
      contact_email: "tech@suppliers.com",
      phone: "9000000001",
      address: "Delhi",
    },
    {
      name: "Gadget Hub",
      contact_email: "gadget@suppliers.com",
      phone: "9000000002",
      address: "Bangalore",
    },
    {
      name: "ElectroWorld",
      contact_email: "electro@suppliers.com",
      phone: "9000000003",
      address: "Mumbai",
    },
    {
      name: "SupplyCo",
      contact_email: "supply@suppliers.com",
      phone: "9000000004",
      address: "Pune",
    },
    {
      name: "MegaStore",
      contact_email: "mega@suppliers.com",
      phone: "9000000005",
      address: "Hyderabad",
    },
    {
      name: "GlobalTrade",
      contact_email: "global@suppliers.com",
      phone: "9000000006",
      address: "Chennai",
    },
    {
      name: "QuickSupply",
      contact_email: "quick@suppliers.com",
      phone: "9000000007",
      address: "Kolkata",
    },
    {
      name: "SmartGoods",
      contact_email: "smart@suppliers.com",
      phone: "9000000008",
      address: "Noida",
    },
    {
      name: "PrimeSource",
      contact_email: "prime@suppliers.com",
      phone: "9000000009",
      address: "Gurgaon",
    },
    {
      name: "UrbanSupply",
      contact_email: "urban@suppliers.com",
      phone: "9000000010",
      address: "Jaipur",
    },
  ]);

  // INVENTORY LOGS
  await db.insert(inventoryLogsTable).values([
    { product_id: 1, change: 10, type: "purchase" },
    { product_id: 2, change: 25, type: "purchase" },
    { product_id: 3, change: -2, type: "sale" },
    { product_id: 4, change: -1, type: "sale" },
    { product_id: 5, change: 15, type: "purchase" },
    { product_id: 6, change: -2, type: "sale" },
    { product_id: 7, change: 5, type: "purchase" },
    { product_id: 8, change: -1, type: "sale" },
    { product_id: 9, change: 50, type: "purchase" },
    { product_id: 10, change: -2, type: "sale" },
  ]);

  // ANALYTICS
  await db.insert(analyticsTable).values([
    {
      date: "2026-03-01",
      total_sales: 75000,
      total_orders: 2,
      total_customers: 2,
    },
    {
      date: "2026-03-02",
      total_sales: 30000,
      total_orders: 1,
      total_customers: 1,
    },
    {
      date: "2026-03-03",
      total_sales: 4000,
      total_orders: 1,
      total_customers: 1,
    },
    {
      date: "2026-03-04",
      total_sales: 1500,
      total_orders: 1,
      total_customers: 1,
    },
    {
      date: "2026-03-05",
      total_sales: 12000,
      total_orders: 1,
      total_customers: 1,
    },
    {
      date: "2026-03-06",
      total_sales: 1600,
      total_orders: 1,
      total_customers: 1,
    },
    {
      date: "2026-03-07",
      total_sales: 10000,
      total_orders: 1,
      total_customers: 1,
    },
    {
      date: "2026-03-08",
      total_sales: 5000,
      total_orders: 1,
      total_customers: 1,
    },
    {
      date: "2026-03-09",
      total_sales: 250,
      total_orders: 1,
      total_customers: 1,
    },
    {
      date: "2026-03-10",
      total_sales: 400,
      total_orders: 1,
      total_customers: 1,
    },
  ]);

  //   USERS
  await db.insert(usersTable).values([
    { name: "Admin User", email: "admin@company.com", role: "admin" },
    { name: "Staff 1", email: "staff1@company.com", role: "staff" },
    { name: "Staff 2", email: "staff2@company.com", role: "staff" },
    { name: "Staff 3", email: "staff3@company.com", role: "staff" },
    { name: "Staff 4", email: "staff4@company.com", role: "staff" },
    { name: "Staff 5", email: "staff5@company.com", role: "staff" },
    { name: "Staff 6", email: "staff6@company.com", role: "staff" },
    { name: "Staff 7", email: "staff7@company.com", role: "staff" },
    { name: "Staff 8", email: "staff8@company.com", role: "staff" },
    { name: "Staff 9", email: "staff9@company.com", role: "staff" },
  ]);

  console.log("✅ Database seeded successfully!");
}

seed();
