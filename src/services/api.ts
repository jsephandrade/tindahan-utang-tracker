
// API SERVICE: Centralized API calls for the Tindahan Manager
// This file contains all the API endpoints and HTTP methods for backend communication

import { Product, Customer, Transaction, UtangRecord, DashboardStats } from '@/types/store';

// Base API URL - Replace with your actual backend URL
const API_BASE_URL = process.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// Generic API request function with error handling
const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      // TODO: Add authentication headers if needed
      // 'Authorization': `Bearer ${getAuthToken()}`,
    },
    ...options,
  };

  try {
    const response = await fetch(url, defaultOptions);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API Request failed for ${endpoint}:`, error);
    throw error;
  }
};

// PRODUCT API CALLS
export const productApi = {
  // API CALL: Get all products
  getAll: (): Promise<Product[]> => {
    return apiRequest<Product[]>('/products');
  },

  // API CALL: Get single product by ID
  getById: (id: string): Promise<Product> => {
    return apiRequest<Product>(`/products/${id}`);
  },

  // API CALL: Create new product
  create: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> => {
    return apiRequest<Product>('/products', {
      method: 'POST',
      body: JSON.stringify(product),
    });
  },

  // API CALL: Update existing product
  update: (id: string, updates: Partial<Product>): Promise<Product> => {
    return apiRequest<Product>(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  // API CALL: Delete product
  delete: (id: string): Promise<void> => {
    return apiRequest<void>(`/products/${id}`, {
      method: 'DELETE',
    });
  },

  // API CALL: Get low stock products
  getLowStock: (): Promise<Product[]> => {
    return apiRequest<Product[]>('/products/low-stock');
  },
};

// CUSTOMER API CALLS
export const customerApi = {
  // API CALL: Get all customers
  getAll: (): Promise<Customer[]> => {
    return apiRequest<Customer[]>('/customers');
  },

  // API CALL: Get single customer by ID
  getById: (id: string): Promise<Customer> => {
    return apiRequest<Customer>(`/customers/${id}`);
  },

  // API CALL: Create new customer
  create: (customer: Omit<Customer, 'id' | 'createdAt' | 'totalUtang'>): Promise<Customer> => {
    return apiRequest<Customer>('/customers', {
      method: 'POST',
      body: JSON.stringify(customer),
    });
  },

  // API CALL: Update existing customer
  update: (id: string, updates: Partial<Customer>): Promise<Customer> => {
    return apiRequest<Customer>(`/customers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  // API CALL: Delete customer
  delete: (id: string): Promise<void> => {
    return apiRequest<void>(`/customers/${id}`, {
      method: 'DELETE',
    });
  },
};

// TRANSACTION API CALLS
export const transactionApi = {
  // API CALL: Get all transactions
  getAll: (): Promise<Transaction[]> => {
    return apiRequest<Transaction[]>('/transactions');
  },

  // API CALL: Get single transaction by ID
  getById: (id: string): Promise<Transaction> => {
    return apiRequest<Transaction>(`/transactions/${id}`);
  },

  // API CALL: Create new transaction
  create: (transaction: Omit<Transaction, 'id' | 'createdAt'>): Promise<Transaction> => {
    return apiRequest<Transaction>('/transactions', {
      method: 'POST',
      body: JSON.stringify(transaction),
    });
  },

  // API CALL: Get transactions by customer ID
  getByCustomerId: (customerId: string): Promise<Transaction[]> => {
    return apiRequest<Transaction[]>(`/transactions/customer/${customerId}`);
  },

  // API CALL: Get transactions by date range
  getByDateRange: (startDate: string, endDate: string): Promise<Transaction[]> => {
    return apiRequest<Transaction[]>(`/transactions/date-range?start=${startDate}&end=${endDate}`);
  },
};

// UTANG API CALLS
export const utangApi = {
  // API CALL: Get all utang records
  getAll: (): Promise<UtangRecord[]> => {
    return apiRequest<UtangRecord[]>('/utang-records');
  },

  // API CALL: Get single utang record by ID
  getById: (id: string): Promise<UtangRecord> => {
    return apiRequest<UtangRecord>(`/utang-records/${id}`);
  },

  // API CALL: Create new utang record
  create: (record: Omit<UtangRecord, 'id' | 'createdAt'>): Promise<UtangRecord> => {
    return apiRequest<UtangRecord>('/utang-records', {
      method: 'POST',
      body: JSON.stringify(record),
    });
  },

  // API CALL: Add payment to utang record
  addPayment: (utangId: string, payment: { amount: number; note?: string }): Promise<UtangRecord> => {
    return apiRequest<UtangRecord>(`/utang-records/${utangId}/payments`, {
      method: 'POST',
      body: JSON.stringify(payment),
    });
  },

  // API CALL: Get utang records by customer ID
  getByCustomerId: (customerId: string): Promise<UtangRecord[]> => {
    return apiRequest<UtangRecord[]>(`/utang-records/customer/${customerId}`);
  },

  // API CALL: Get unpaid utang records
  getUnpaid: (): Promise<UtangRecord[]> => {
    return apiRequest<UtangRecord[]>('/utang-records/unpaid');
  },

  // API CALL: Update utang record status
  updateStatus: (id: string, status: 'unpaid' | 'partial' | 'paid'): Promise<UtangRecord> => {
    return apiRequest<UtangRecord>(`/utang-records/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },
};

// DASHBOARD API CALLS
export const dashboardApi = {
  // API CALL: Get dashboard statistics
  getStats: (): Promise<DashboardStats> => {
    return apiRequest<DashboardStats>('/dashboard/stats');
  },

  // API CALL: Get sales data for charts
  getSalesData: (period: 'daily' | 'weekly' | 'monthly'): Promise<any[]> => {
    return apiRequest<any[]>(`/dashboard/sales-data?period=${period}`);
  },

  // API CALL: Get top selling products
  getTopProducts: (limit: number = 10): Promise<Product[]> => {
    return apiRequest<Product[]>(`/dashboard/top-products?limit=${limit}`);
  },

  // API CALL: Get recent transactions
  getRecentTransactions: (limit: number = 10): Promise<Transaction[]> => {
    return apiRequest<Transaction[]>(`/dashboard/recent-transactions?limit=${limit}`);
  },
};

// SEARCH API CALLS
export const searchApi = {
  // API CALL: Search products
  searchProducts: (query: string): Promise<Product[]> => {
    return apiRequest<Product[]>(`/search/products?q=${encodeURIComponent(query)}`);
  },

  // API CALL: Search customers
  searchCustomers: (query: string): Promise<Customer[]> => {
    return apiRequest<Customer[]>(`/search/customers?q=${encodeURIComponent(query)}`);
  },

  // API CALL: Search transactions
  searchTransactions: (query: string): Promise<Transaction[]> => {
    return apiRequest<Transaction[]>(`/search/transactions?q=${encodeURIComponent(query)}`);
  },
};

// REPORTS API CALLS
export const reportsApi = {
  // API CALL: Generate sales report
  getSalesReport: (startDate: string, endDate: string): Promise<any> => {
    return apiRequest<any>(`/reports/sales?start=${startDate}&end=${endDate}`);
  },

  // API CALL: Generate inventory report
  getInventoryReport: (): Promise<any> => {
    return apiRequest<any>('/reports/inventory');
  },

  // API CALL: Generate utang report
  getUtangReport: (): Promise<any> => {
    return apiRequest<any>('/reports/utang');
  },

  // API CALL: Generate customer report
  getCustomerReport: (): Promise<any> => {
    return apiRequest<any>('/reports/customers');
  },
};

// Export all API functions
export const api = {
  products: productApi,
  customers: customerApi,
  transactions: transactionApi,
  utang: utangApi,
  dashboard: dashboardApi,
  search: searchApi,
  reports: reportsApi,
};

export default api;
