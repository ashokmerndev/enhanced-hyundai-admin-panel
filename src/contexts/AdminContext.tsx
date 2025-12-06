import React, { createContext, useContext, useState, ReactNode } from 'react';
import productsData from '@/data/mockProducts.json';
import ordersData from '@/data/mockOrders.json';
import customersData from '@/data/mockCustomers.json';
import chatsData from '@/data/mockChats.json';
import analyticsData from '@/data/mockAnalytics.json';

interface Product {
  id: string;
  name: string;
  partNumber: string;
  category: string;
  price: number;
  stock: number;
  model: string;
  images: string[];
  description: string;
  supplier: string;
  status: string;
}

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  items: Array<{
    productId: string;
    name: string;
    quantity: number;
    price: number;
    image?: string;
  }>;
  totalAmount: number;
  status: string;
  orderDate: string;
  deliveryDate?: string;
  shippingAddress: string;
  paymentMethod: string;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  totalOrders: number;
  totalSpent: number;
  joinDate: string;
  status: string;
  avatar: string;
}

interface Chat {
  id: string;
  customerId: string;
  customerName: string;
  status: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: Array<{
    id: string;
    sender: string;
    text: string;
    timestamp: string;
  }>;
}

interface Analytics {
  todayStats: {
    totalSales: number;
    ordersCount: number;
    lowStockAlerts: number;
    pendingShipments: number;
  };
  monthlyRevenue: Array<{ month: string; revenue: number }>;
  topSellingProducts: Array<{
    id: string;
    name: string;
    soldUnits: number;
    revenue: number;
  }>;
  categoryDistribution: Array<{ name: string; value: number }>;
  recentActivity: Array<{
    id: number;
    type: string;
    message: string;
    time: string;
  }>;
}

interface AdminContextType {
  products: Product[];
  orders: Order[];
  customers: Customer[];
  chats: Chat[];
  analytics: Analytics;
  addProduct: (product: Product) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  updateOrderStatus: (id: string, status: string) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(productsData);
  const [orders, setOrders] = useState<Order[]>(ordersData);
  const [customers] = useState<Customer[]>(customersData);
  const [chats] = useState<Chat[]>(chatsData);
  const [analytics] = useState<Analytics>(analyticsData);

  const addProduct = (product: Product) => {
    setProducts([...products, product]);
  };

  const updateProduct = (id: string, updatedProduct: Partial<Product>) => {
    setProducts(products.map(p => (p.id === id ? { ...p, ...updatedProduct } : p)));
  };

  const deleteProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const updateOrderStatus = (id: string, status: string) => {
    setOrders(orders.map(o => (o.id === id ? { ...o, status } : o)));
  };

  return (
    <AdminContext.Provider
      value={{
        products,
        orders,
        customers,
        chats,
        analytics,
        addProduct,
        updateProduct,
        deleteProduct,
        updateOrderStatus,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
