export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          name: string
          role: 'customer' | 'vendor' | 'admin'
          status: string
          avatar_url: string | null
          phone: string | null
          address: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name: string
          role?: 'customer' | 'vendor' | 'admin'
          status?: string
          avatar_url?: string | null
          phone?: string | null
          address?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          role?: 'customer' | 'vendor' | 'admin'
          status?: string
          avatar_url?: string | null
          phone?: string | null
          address?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          icon: string
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          icon: string
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          icon?: string
          description?: string | null
          created_at?: string
        }
      }
      subcategories: {
        Row: {
          id: string
          category_id: string
          name: string
          slug: string
          created_at: string
        }
        Insert: {
          id?: string
          category_id: string
          name: string
          slug: string
          created_at?: string
        }
        Update: {
          id?: string
          category_id?: string
          name?: string
          slug?: string
          created_at?: string
        }
      }
      vendor_applications: {
        Row: {
          id: string
          user_id: string
          applicant_name: string
          email: string
          phone: string
          business_name: string
          business_type: string
          description: string
          experience: string | null
          address: string
          status: 'pending' | 'approved' | 'rejected'
          notes: string | null
          reviewed_by: string | null
          reviewed_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          applicant_name: string
          email: string
          phone: string
          business_name: string
          business_type: string
          description: string
          experience?: string | null
          address: string
          status?: 'pending' | 'approved' | 'rejected'
          notes?: string | null
          reviewed_by?: string | null
          reviewed_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          applicant_name?: string
          email?: string
          phone?: string
          business_name?: string
          business_type?: string
          description?: string
          experience?: string | null
          address?: string
          status?: 'pending' | 'approved' | 'rejected'
          notes?: string | null
          reviewed_by?: string | null
          reviewed_at?: string | null
          created_at?: string
        }
      }
      products: {
        Row: {
          id: string
          vendor_id: string
          title: string
          description: string
          price: number
          original_price: number | null
          images: string[]
          category_id: string | null
          subcategory_id: string | null
          purchase_url: string
          stock: number
          tags: string[]
          status: 'active' | 'inactive' | 'pending'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          vendor_id: string
          title: string
          description: string
          price: number
          original_price?: number | null
          images?: string[]
          category_id?: string | null
          subcategory_id?: string | null
          purchase_url: string
          stock?: number
          tags?: string[]
          status?: 'active' | 'inactive' | 'pending'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          vendor_id?: string
          title?: string
          description?: string
          price?: number
          original_price?: number | null
          images?: string[]
          category_id?: string | null
          subcategory_id?: string | null
          purchase_url?: string
          stock?: number
          tags?: string[]
          status?: 'active' | 'inactive' | 'pending'
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          customer_id: string
          total: number
          status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
          shipping_address: string
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          customer_id: string
          total: number
          status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
          shipping_address: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          customer_id?: string
          total?: number
          status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
          shipping_address?: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          quantity: number
          price: number
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          product_id: string
          quantity: number
          price: number
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string
          quantity?: number
          price?: number
          created_at?: string
        }
      }
      cart_items: {
        Row: {
          id: string
          user_id: string
          product_id: string
          quantity: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          product_id: string
          quantity: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          product_id?: string
          quantity?: number
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: 'customer' | 'vendor' | 'admin'
      application_status: 'pending' | 'approved' | 'rejected'
      product_status: 'active' | 'inactive' | 'pending'
      order_status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
    }
  }
}