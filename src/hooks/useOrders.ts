import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Database } from '../lib/database.types';

type Order = Database['public']['Tables']['orders']['Row'] & {
  customer_profile?: {
    name: string;
    email: string;
  };
  order_items: Array<Database['public']['Tables']['order_items']['Row'] & {
    product: Database['public']['Tables']['products']['Row'];
  }>;
};

interface UseOrdersOptions {
  customerId?: string;
  vendorId?: string;
  status?: string;
}

export const useOrders = (options: UseOrdersOptions = {}) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, [options.customerId, options.vendorId, options.status]);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      let query = supabase
        .from('orders')
        .select(`
          *,
          customer_profile:profiles!orders_customer_id_fkey(name, email),
          order_items(
            *,
            product:products(*)
          )
        `);

      if (options.customerId) {
        query = query.eq('customer_id', options.customerId);
      }
      if (options.status) {
        query = query.eq('status', options.status);
      }

      // For vendor-specific orders, we need to filter by products
      if (options.vendorId) {
        query = query.eq('order_items.product.vendor_id', options.vendorId);
      }

      query = query.order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error) {
        setError(error.message);
        return;
      }

      setOrders(data || []);
    } catch (err) {
      setError('Failed to fetch orders');
      console.error('Error fetching orders:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const createOrder = async (orderData: {
    customer_id: string;
    total: number;
    shipping_address: string;
    notes?: string;
    items: Array<{
      product_id: string;
      quantity: number;
      price: number;
    }>;
  }) => {
    try {
      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_id: orderData.customer_id,
          total: orderData.total,
          shipping_address: orderData.shipping_address,
          notes: orderData.notes || null,
        })
        .select()
        .single();

      if (orderError) {
        console.error('Error creating order:', orderError);
        return null;
      }

      // Create order items
      const orderItems = orderData.items.map(item => ({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) {
        console.error('Error creating order items:', itemsError);
        return null;
      }

      await fetchOrders();
      return order;
    } catch (err) {
      console.error('Error creating order:', err);
      return null;
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId);

      if (error) {
        console.error('Error updating order status:', error);
        return false;
      }

      await fetchOrders();
      return true;
    } catch (err) {
      console.error('Error updating order status:', err);
      return false;
    }
  };

  return { 
    orders, 
    isLoading, 
    error, 
    refetch: fetchOrders,
    createOrder,
    updateOrderStatus 
  };
};