import { text, integer, real, sqliteTable } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

// PRODUCTS TABLE
export const productsTable = sqliteTable("products", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  category: text("category").notNull(),
  price: real("price").notNull(),
  stock: integer("stock").notNull().default(0),
  created_at: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// SALES TABLE
export const salesTable = sqliteTable("sales", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  product_id: integer("product_id")
    .notNull()
    .references(() => productsTable.id),
  quantity: integer("quantity").notNull(),
  total_amount: real("total_amount").notNull(),
  sale_date: text("sale_date").default(sql`CURRENT_TIMESTAMP`),
  customer_name: text("customer_name").notNull(),
  region: text("region").notNull(),
});

// CUSTOMERS TABLE
export const customersTable = sqliteTable("customers", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").unique().notNull(),
  phone: text("phone"),
  address: text("address"),
  created_at: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// ORDERS TABLE
export const ordersTable = sqliteTable("orders", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  customer_id: integer("customer_id")
    .notNull()
    .references(() => customersTable.id),
  total_amount: real("total_amount").notNull(),
  status: text("status").default("pending"), // pending, completed, cancelled
  created_at: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// ORDER ITEMS TABLE
export const orderItemsTable = sqliteTable("order_items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  order_id: integer("order_id")
    .notNull()
    .references(() => ordersTable.id),
  product_id: integer("product_id")
    .notNull()
    .references(() => productsTable.id),
  quantity: integer("quantity").notNull(),
  price: real("price").notNull(),
});

// SUPPLIERS TABLE
export const suppliersTable = sqliteTable("suppliers", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  contact_email: text("contact_email"),
  phone: text("phone"),
  address: text("address"),
});

// INVENTORY LOGS TABLE
export const inventoryLogsTable = sqliteTable("inventory_logs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  product_id: integer("product_id")
    .notNull()
    .references(() => productsTable.id),
  change: integer("change").notNull(), // +10, -5
  type: text("type").notNull(), // purchase, sale, adjustment
  created_at: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// ANALYTICS TABLE
export const analyticsTable = sqliteTable("analytics", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  date: text("date").notNull(),
  total_sales: real("total_sales").default(0),
  total_orders: integer("total_orders").default(0),
  total_customers: integer("total_customers").default(0),
});

// USERS TABLE (ADMIN / STAFF)
export const usersTable = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").unique().notNull(),
  role: text("role").default("admin"), // admin, staff
  created_at: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});
