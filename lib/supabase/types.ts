export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          name: string | null
          phone: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name?: string | null
          phone?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string | null
          phone?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      cart_items: {
        Row: {
          id: string
          user_id: string
          variant_id: string
          quantity: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          variant_id: string
          quantity?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          variant_id?: string
          quantity?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      coupons: {
        Row: {
          code: string
          created_at: string
          discount_type: string
          discount_value: number
          expiry_date: string | null
          id: string
          is_active: boolean
          min_order_value: number | null
          times_used: number
          usage_limit: number | null
        }
        Insert: {
          code: string
          created_at?: string
          discount_type?: string
          discount_value?: number
          expiry_date?: string | null
          id?: string
          is_active?: boolean
          min_order_value?: number | null
          times_used?: number
          usage_limit?: number | null
        }
        Update: {
          code?: string
          created_at?: string
          discount_type?: string
          discount_value?: number
          expiry_date?: string | null
          id?: string
          is_active?: boolean
          min_order_value?: number | null
          times_used?: number
          usage_limit?: number | null
        }
        Relationships: []
      }
      hero_slides: {
        Row: {
          created_at: string
          display_order: number
          id: string
          image_url: string
          is_active: boolean
          link_url: string | null
          overlay_text: string | null
        }
        Insert: {
          created_at?: string
          display_order?: number
          id?: string
          image_url: string
          is_active?: boolean
          link_url?: string | null
          overlay_text?: string | null
        }
        Update: {
          created_at?: string
          display_order?: number
          id?: string
          image_url?: string
          is_active?: boolean
          link_url?: string | null
          overlay_text?: string | null
        }
        Relationships: []
      }
      newsletter_subscribers: {
        Row: {
          email: string
          id: string
          is_active: boolean
          subscribed_at: string
        }
        Insert: {
          email: string
          id?: string
          is_active?: boolean
          subscribed_at?: string
        }
        Update: {
          email?: string
          id?: string
          is_active?: boolean
          subscribed_at?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string
          id: string
          is_read: boolean
          recipient_id: string | null
          title: string
          type: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          recipient_id?: string | null
          title: string
          type?: string
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          recipient_id?: string | null
          title?: string
          type?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          id: string
          line_total: number
          order_id: string
          quantity: number
          unit_price: number
          variant_id: string | null
        }
        Insert: {
          id?: string
          line_total?: number
          order_id: string
          quantity?: number
          unit_price?: number
          variant_id?: string | null
        }
        Update: {
          id?: string
          line_total?: number
          order_id?: string
          quantity?: number
          unit_price?: number
          variant_id?: string | null
        }
        Relationships: []
      }
      orders: {
        Row: {
          carrier_name: string | null
          coupon_id: string | null
          created_at: string
          discount_amount: number
          id: string
          shipping_address: Json | null
          shipping_fee: number
          status: Database['public']['Enums']['order_status']
          total_amount: number
          tracking_id: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          carrier_name?: string | null
          coupon_id?: string | null
          created_at?: string
          discount_amount?: number
          id?: string
          shipping_address?: Json | null
          shipping_fee?: number
          status?: Database['public']['Enums']['order_status']
          total_amount?: number
          tracking_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          carrier_name?: string | null
          coupon_id?: string | null
          created_at?: string
          discount_amount?: number
          id?: string
          shipping_address?: Json | null
          shipping_fee?: number
          status?: Database['public']['Enums']['order_status']
          total_amount?: number
          tracking_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          gateway_reference: string | null
          id: string
          method: string | null
          order_id: string
          razorpay_order_id: string | null
          razorpay_payment_id: string | null
          status: string
        }
        Insert: {
          amount?: number
          created_at?: string
          gateway_reference?: string | null
          id?: string
          method?: string | null
          order_id: string
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          status?: string
        }
        Update: {
          amount?: number
          created_at?: string
          gateway_reference?: string | null
          id?: string
          method?: string | null
          order_id?: string
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          status?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          base_price: number
          category_id: string | null
          created_at: string
          description: string | null
          id: string
          images: string[] | null
          is_active: boolean
          name: string
          updated_at: string
        }
        Insert: {
          base_price?: number
          category_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          images?: string[] | null
          is_active?: boolean
          name: string
          updated_at?: string
        }
        Update: {
          base_price?: number
          category_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          images?: string[] | null
          is_active?: boolean
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      stock_audit_log: {
        Row: {
          admin_id: string | null
          created_at: string
          id: string
          new_qty: number
          prev_qty: number
          reason: string | null
          variant_id: string
        }
        Insert: {
          admin_id?: string | null
          created_at?: string
          id?: string
          new_qty: number
          prev_qty: number
          reason?: string | null
          variant_id: string
        }
        Update: {
          admin_id?: string | null
          created_at?: string
          id?: string
          new_qty?: number
          prev_qty?: number
          reason?: string | null
          variant_id?: string
        }
        Relationships: []
      }
      system_config: {
        Row: {
          key: string
          value: string
          updated_at: string
        }
        Insert: {
          key: string
          value: string
          updated_at?: string
        }
        Update: {
          key?: string
          value?: string
          updated_at?: string
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          content: string
          customer_name: string
          id: string
          rating: number
          status: Database['public']['Enums']['testimonial_status']
          submitted_at: string
        }
        Insert: {
          content: string
          customer_name: string
          id?: string
          rating?: number
          status?: Database['public']['Enums']['testimonial_status']
          submitted_at?: string
        }
        Update: {
          content?: string
          customer_name?: string
          id?: string
          rating?: number
          status?: Database['public']['Enums']['testimonial_status']
          submitted_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database['public']['Enums']['app_role']
          user_id: string
        }
        Insert: {
          id?: string
          role: Database['public']['Enums']['app_role']
          user_id: string
        }
        Update: {
          id?: string
          role?: Database['public']['Enums']['app_role']
          user_id?: string
        }
        Relationships: []
      }
      variants: {
        Row: {
          color: string
          created_at: string
          id: string
          low_stock_threshold: number
          price_override: number | null
          product_id: string
          size: string
          sku: string
          stock_quantity: number
        }
        Insert: {
          color: string
          created_at?: string
          id?: string
          low_stock_threshold?: number
          price_override?: number | null
          product_id: string
          size: string
          sku: string
          stock_quantity?: number
        }
        Update: {
          color?: string
          created_at?: string
          id?: string
          low_stock_threshold?: number
          price_override?: number | null
          product_id?: string
          size?: string
          sku?: string
          stock_quantity?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      deduct_stock: {
        Args: { p_variant_id: string; p_qty: number }
        Returns: boolean
      }
      deduct_stock_for_order: {
        Args: { p_order_id: string }
        Returns: boolean
      }
      restore_stock: {
        Args: { p_variant_id: string; p_qty: number }
        Returns: undefined
      }
      restore_stock_for_order: {
        Args: { p_order_id: string }
        Returns: undefined
      }
      has_role: {
        Args: { _role: Database['public']['Enums']['app_role']; _user_id: string }
        Returns: boolean
      }
      is_admin: {
        Args: Record<string, never>
        Returns: boolean
      }
    }
    Enums: {
      app_role: 'admin' | 'moderator' | 'user'
      order_status:
        | 'placed'
        | 'confirmed'
        | 'processing'
        | 'shipped'
        | 'out_for_delivery'
        | 'delivered'
        | 'cancelled'
      testimonial_status: 'pending' | 'approved' | 'rejected'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row']
export type Enums<T extends keyof Database['public']['Enums']> =
  Database['public']['Enums'][T]
export type TablesInsert<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert']
export type TablesUpdate<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update']
