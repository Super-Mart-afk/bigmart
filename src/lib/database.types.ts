import type { InferSelectModel, InferInsertModel } from 'drizzle-orm';
import * as schema from './schema';

// Export types for all tables
export type Profile = InferSelectModel<typeof schema.profiles>;
export type NewProfile = InferInsertModel<typeof schema.profiles>;

export type Category = InferSelectModel<typeof schema.categories>;
export type NewCategory = InferInsertModel<typeof schema.categories>;

export type Subcategory = InferSelectModel<typeof schema.subcategories>;
export type NewSubcategory = InferInsertModel<typeof schema.subcategories>;

export type Product = InferSelectModel<typeof schema.products>;
export type NewProduct = InferInsertModel<typeof schema.products>;

export type Order = InferSelectModel<typeof schema.orders>;
export type NewOrder = InferInsertModel<typeof schema.orders>;

export type OrderItem = InferSelectModel<typeof schema.orderItems>;
export type NewOrderItem = InferInsertModel<typeof schema.orderItems>;

export type CartItem = InferSelectModel<typeof schema.cartItems>;
export type NewCartItem = InferInsertModel<typeof schema.cartItems>;

export type VendorApplication = InferSelectModel<typeof schema.vendorApplications>;
export type NewVendorApplication = InferInsertModel<typeof schema.vendorApplications>;

// Extended types with relations
export type ProductWithRelations = Product & {
  vendor?: Profile;
  category?: Category;
  subcategory?: Subcategory;
  vendor_name?: string;
  category_name?: string;
  subcategory_name?: string;
};

export type OrderWithRelations = Order & {
  customer?: Profile;
  orderItems?: (OrderItem & { product?: Product })[];
  customer_profile?: {
    name: string;
    email: string;
  };
};

export type VendorApplicationWithRelations = VendorApplication & {
  applicant_profile?: {
    name: string;
    email: string;
  };
  reviewer_profile?: {
    name: string;
  };
};

export type CartItemWithProduct = CartItem & {
  product: ProductWithRelations;
};

export type CategoryWithSubcategories = Category & {
  subcategories: Subcategory[];
};

// Supabase Database interface
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: NewProfile;
        Update: Partial<NewProfile>;
      };
      categories: {
        Row: Category;
        Insert: NewCategory;
        Update: Partial<NewCategory>;
      };
      subcategories: {
        Row: Subcategory;
        Insert: NewSubcategory;
        Update: Partial<NewSubcategory>;
      };
      products: {
        Row: Product;
        Insert: NewProduct;
        Update: Partial<NewProduct>;
      };
      orders: {
        Row: Order;
        Insert: NewOrder;
        Update: Partial<NewOrder>;
      };
      order_items: {
        Row: OrderItem;
        Insert: NewOrderItem;
        Update: Partial<NewOrderItem>;
      };
      cart_items: {
        Row: CartItem;
        Insert: NewCartItem;
        Update: Partial<NewCartItem>;
      };
      vendor_applications: {
        Row: VendorApplication;
        Insert: NewVendorApplication;
        Update: Partial<NewVendorApplication>;
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      user_role: 'customer' | 'vendor' | 'admin';
      application_status: 'pending' | 'approved' | 'rejected';
      product_status: 'active' | 'inactive' | 'pending';
      order_status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    };
  };
}