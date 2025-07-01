import { mysqlTable, varchar, text, decimal, int, timestamp, json, mysqlEnum, boolean, primaryKey, index } from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';

// Enums
export const userRoleEnum = mysqlEnum('user_role', ['customer', 'vendor', 'admin']);
export const applicationStatusEnum = mysqlEnum('application_status', ['pending', 'approved', 'rejected']);
export const productStatusEnum = mysqlEnum('product_status', ['active', 'inactive', 'pending']);
export const orderStatusEnum = mysqlEnum('order_status', ['pending', 'processing', 'shipped', 'delivered', 'cancelled']);

// Profiles table
export const profiles = mysqlTable('profiles', {
  id: varchar('id', { length: 255 }).primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  role: userRoleEnum.default('customer'),
  status: varchar('status', { length: 50 }).default('active'),
  avatarUrl: text('avatar_url'),
  phone: varchar('phone', { length: 50 }),
  address: text('address'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
});

// Categories table
export const categories = mysqlTable('categories', {
  id: varchar('id', { length: 255 }).primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  icon: varchar('icon', { length: 100 }).notNull(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Subcategories table
export const subcategories = mysqlTable('subcategories', {
  id: varchar('id', { length: 255 }).primaryKey(),
  categoryId: varchar('category_id', { length: 255 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  categoryIdx: index('category_idx').on(table.categoryId),
}));

// Vendor applications table
export const vendorApplications = mysqlTable('vendor_applications', {
  id: varchar('id', { length: 255 }).primaryKey(),
  userId: varchar('user_id', { length: 255 }).notNull(),
  applicantName: varchar('applicant_name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 50 }).notNull(),
  businessName: varchar('business_name', { length: 255 }).notNull(),
  businessType: varchar('business_type', { length: 100 }).notNull(),
  description: text('description').notNull(),
  experience: text('experience'),
  address: text('address').notNull(),
  status: applicationStatusEnum.default('pending'),
  notes: text('notes'),
  reviewedBy: varchar('reviewed_by', { length: 255 }),
  reviewedAt: timestamp('reviewed_at'),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  userIdx: index('user_idx').on(table.userId),
  statusIdx: index('status_idx').on(table.status),
}));

// Products table
export const products = mysqlTable('products', {
  id: varchar('id', { length: 255 }).primaryKey(),
  vendorId: varchar('vendor_id', { length: 255 }).notNull(),
  title: varchar('title', { length: 500 }).notNull(),
  description: text('description').notNull(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  originalPrice: decimal('original_price', { precision: 10, scale: 2 }),
  images: json('images').$type<string[]>().default([]),
  categoryId: varchar('category_id', { length: 255 }),
  subcategoryId: varchar('subcategory_id', { length: 255 }),
  purchaseUrl: text('purchase_url').notNull(),
  stock: int('stock').default(0),
  tags: json('tags').$type<string[]>().default([]),
  status: productStatusEnum.default('pending'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
}, (table) => ({
  vendorIdx: index('vendor_idx').on(table.vendorId),
  categoryIdx: index('category_idx').on(table.categoryId),
  statusIdx: index('status_idx').on(table.status),
}));

// Orders table
export const orders = mysqlTable('orders', {
  id: varchar('id', { length: 255 }).primaryKey(),
  customerId: varchar('customer_id', { length: 255 }).notNull(),
  total: decimal('total', { precision: 10, scale: 2 }).notNull(),
  status: orderStatusEnum.default('pending'),
  shippingAddress: text('shipping_address').notNull(),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
}, (table) => ({
  customerIdx: index('customer_idx').on(table.customerId),
  statusIdx: index('status_idx').on(table.status),
}));

// Order items table
export const orderItems = mysqlTable('order_items', {
  id: varchar('id', { length: 255 }).primaryKey(),
  orderId: varchar('order_id', { length: 255 }).notNull(),
  productId: varchar('product_id', { length: 255 }).notNull(),
  quantity: int('quantity').notNull(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  orderIdx: index('order_idx').on(table.orderId),
  productIdx: index('product_idx').on(table.productId),
}));

// Cart items table
export const cartItems = mysqlTable('cart_items', {
  id: varchar('id', { length: 255 }).primaryKey(),
  userId: varchar('user_id', { length: 255 }).notNull(),
  productId: varchar('product_id', { length: 255 }).notNull(),
  quantity: int('quantity').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
}, (table) => ({
  userProductIdx: index('user_product_idx').on(table.userId, table.productId),
}));

// Relations
export const profilesRelations = relations(profiles, ({ many }) => ({
  products: many(products),
  orders: many(orders),
  cartItems: many(cartItems),
  vendorApplications: many(vendorApplications),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  subcategories: many(subcategories),
  products: many(products),
}));

export const subcategoriesRelations = relations(subcategories, ({ one, many }) => ({
  category: one(categories, {
    fields: [subcategories.categoryId],
    references: [categories.id],
  }),
  products: many(products),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  vendor: one(profiles, {
    fields: [products.vendorId],
    references: [profiles.id],
  }),
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  subcategory: one(subcategories, {
    fields: [products.subcategoryId],
    references: [subcategories.id],
  }),
  orderItems: many(orderItems),
  cartItems: many(cartItems),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  customer: one(profiles, {
    fields: [orders.customerId],
    references: [profiles.id],
  }),
  orderItems: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}));

export const cartItemsRelations = relations(cartItems, ({ one }) => ({
  user: one(profiles, {
    fields: [cartItems.userId],
    references: [profiles.id],
  }),
  product: one(products, {
    fields: [cartItems.productId],
    references: [products.id],
  }),
}));

export const vendorApplicationsRelations = relations(vendorApplications, ({ one }) => ({
  user: one(profiles, {
    fields: [vendorApplications.userId],
    references: [profiles.id],
  }),
  reviewer: one(profiles, {
    fields: [vendorApplications.reviewedBy],
    references: [profiles.id],
  }),
}));