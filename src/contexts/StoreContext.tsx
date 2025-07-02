
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Customer, Transaction, UtangRecord, DashboardStats } from '@/types/store';

interface StoreContextType {
  // Products
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  
  // Customers
  customers: Customer[];
  addCustomer: (customer: Omit<Customer, 'id' | 'createdAt' | 'totalUtang'>) => void;
  updateCustomer: (id: string, updates: Partial<Customer>) => void;
  
  // Transactions
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt'>) => void;
  
  // Utang
  utangRecords: UtangRecord[];
  addUtangRecord: (record: Omit<UtangRecord, 'id' | 'createdAt'>) => void;
  addPayment: (utangId: string, amount: number, note?: string) => void;
  
  // Dashboard
  getDashboardStats: () => DashboardStats;
  
  // Loading states
  isLoading: boolean;
  error: string | null;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [utangRecords, setUtangRecords] = useState<UtangRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // API CALL: Fetch all products from backend
  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API endpoint
      // const response = await fetch('/api/products');
      // const data = await response.json();
      // setProducts(data);
      
      // For now, initialize with empty array
      setProducts([]);
    } catch (err) {
      setError('Failed to fetch products');
      console.error('Error fetching products:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // API CALL: Fetch all customers from backend
  const fetchCustomers = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API endpoint
      // const response = await fetch('/api/customers');
      // const data = await response.json();
      // setCustomers(data);
      
      // For now, initialize with empty array
      setCustomers([]);
    } catch (err) {
      setError('Failed to fetch customers');
      console.error('Error fetching customers:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // API CALL: Fetch all transactions from backend
  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API endpoint
      // const response = await fetch('/api/transactions');
      // const data = await response.json();
      // setTransactions(data);
      
      // For now, initialize with empty array
      setTransactions([]);
    } catch (err) {
      setError('Failed to fetch transactions');
      console.error('Error fetching transactions:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // API CALL: Fetch all utang records from backend
  const fetchUtangRecords = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API endpoint
      // const response = await fetch('/api/utang-records');
      // const data = await response.json();
      // setUtangRecords(data);
      
      // For now, initialize with empty array
      setUtangRecords([]);
    } catch (err) {
      setError('Failed to fetch utang records');
      console.error('Error fetching utang records:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Load all data on component mount
  useEffect(() => {
    fetchProducts();
    fetchCustomers();
    fetchTransactions();
    fetchUtangRecords();
  }, []);

  // API CALL: Add new product to backend
  const addProduct = async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API endpoint
      // const response = await fetch('/api/products', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(productData)
      // });
      // const newProduct = await response.json();
      // setProducts(prev => [...prev, newProduct]);

      // For now, create a temporary product with mock ID
      const newProduct: Product = {
        ...productData,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setProducts(prev => [...prev, newProduct]);
    } catch (err) {
      setError('Failed to add product');
      console.error('Error adding product:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // API CALL: Update existing product in backend
  const updateProduct = async (id: string, updates: Partial<Product>) => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API endpoint
      // const response = await fetch(`/api/products/${id}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(updates)
      // });
      // const updatedProduct = await response.json();

      setProducts(prev =>
        prev.map(product =>
          product.id === id
            ? { ...product, ...updates, updatedAt: new Date() }
            : product
        )
      );
    } catch (err) {
      setError('Failed to update product');
      console.error('Error updating product:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // API CALL: Delete product from backend
  const deleteProduct = async (id: string) => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API endpoint
      // await fetch(`/api/products/${id}`, { method: 'DELETE' });
      
      setProducts(prev => prev.filter(product => product.id !== id));
    } catch (err) {
      setError('Failed to delete product');
      console.error('Error deleting product:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // API CALL: Add new customer to backend
  const addCustomer = async (customerData: Omit<Customer, 'id' | 'createdAt' | 'totalUtang'>) => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API endpoint
      // const response = await fetch('/api/customers', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(customerData)
      // });
      // const newCustomer = await response.json();
      // setCustomers(prev => [...prev, newCustomer]);

      // For now, create a temporary customer with mock ID
      const newCustomer: Customer = {
        ...customerData,
        id: Date.now().toString(),
        totalUtang: 0,
        createdAt: new Date(),
      };
      setCustomers(prev => [...prev, newCustomer]);
    } catch (err) {
      setError('Failed to add customer');
      console.error('Error adding customer:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // API CALL: Update existing customer in backend
  const updateCustomer = async (id: string, updates: Partial<Customer>) => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API endpoint
      // const response = await fetch(`/api/customers/${id}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(updates)
      // });
      // const updatedCustomer = await response.json();

      setCustomers(prev =>
        prev.map(customer =>
          customer.id === id ? { ...customer, ...updates } : customer
        )
      );
    } catch (err) {
      setError('Failed to update customer');
      console.error('Error updating customer:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // API CALL: Add new transaction to backend
  const addTransaction = async (transactionData: Omit<Transaction, 'id' | 'createdAt'>) => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API endpoint
      // const response = await fetch('/api/transactions', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(transactionData)
      // });
      // const newTransaction = await response.json();

      const newTransaction: Transaction = {
        ...transactionData,
        id: Date.now().toString(),
        createdAt: new Date(),
      };
      
      setTransactions(prev => [...prev, newTransaction]);
      
      // Update product stock
      transactionData.items.forEach(item => {
        updateProduct(item.productId, {
          stock: products.find(p => p.id === item.productId)!.stock - item.quantity
        });
      });
      
      // Create utang record if needed
      if (transactionData.utangAmount > 0 && transactionData.customerId) {
        const utangRecord: Omit<UtangRecord, 'id' | 'createdAt'> = {
          customerId: transactionData.customerId,
          customerName: transactionData.customerName || '',
          transactionId: newTransaction.id,
          amount: transactionData.utangAmount,
          description: `Purchase - ${transactionData.items.map(i => i.productName).join(', ')}`,
          status: 'unpaid',
          payments: [],
        };
        addUtangRecord(utangRecord);
      }
    } catch (err) {
      setError('Failed to add transaction');
      console.error('Error adding transaction:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // API CALL: Add new utang record to backend
  const addUtangRecord = async (recordData: Omit<UtangRecord, 'id' | 'createdAt'>) => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API endpoint
      // const response = await fetch('/api/utang-records', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(recordData)
      // });
      // const newRecord = await response.json();

      const newRecord: UtangRecord = {
        ...recordData,
        id: Date.now().toString(),
        createdAt: new Date(),
      };
      setUtangRecords(prev => [...prev, newRecord]);
      
      // Update customer total utang
      const customer = customers.find(c => c.id === recordData.customerId);
      if (customer) {
        updateCustomer(customer.id, {
          totalUtang: customer.totalUtang + recordData.amount
        });
      }
    } catch (err) {
      setError('Failed to add utang record');
      console.error('Error adding utang record:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // API CALL: Add payment to utang record in backend
  const addPayment = async (utangId: string, amount: number, note?: string) => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API endpoint
      // const response = await fetch(`/api/utang-records/${utangId}/payments`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ amount, note })
      // });
      // const updatedRecord = await response.json();

      setUtangRecords(prev =>
        prev.map(record => {
          if (record.id === utangId) {
            const newPayment = {
              id: Date.now().toString(),
              amount,
              date: new Date(),
              note,
            };
            const totalPaid = [...record.payments, newPayment].reduce((sum, p) => sum + p.amount, 0);
            const status = totalPaid >= record.amount ? 'paid' : 'partial';
            
            // Update customer total utang
            const customer = customers.find(c => c.id === record.customerId);
            if (customer) {
              updateCustomer(customer.id, {
                totalUtang: customer.totalUtang - amount
              });
            }
            
            return {
              ...record,
              payments: [...record.payments, newPayment],
              status: status as 'unpaid' | 'partial' | 'paid',
            };
          }
          return record;
        })
      );
    } catch (err) {
      setError('Failed to add payment');
      console.error('Error adding payment:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // API CALL: Get dashboard statistics from backend
  const getDashboardStats = (): DashboardStats => {
    // TODO: Replace with actual API endpoint
    // const response = await fetch('/api/dashboard/stats');
    // return await response.json();

    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    
    const totalSales = transactions.reduce((sum, t) => sum + t.totalAmount, 0);
    const totalUtang = customers.reduce((sum, c) => sum + c.totalUtang, 0);
    const lowStockItems = products.filter(p => p.stock <= p.minStock).length;
    const totalCustomers = customers.length;
    const dailySales = transactions
      .filter(t => t.createdAt >= startOfDay)
      .reduce((sum, t) => sum + t.totalAmount, 0);
    const monthlyUtang = utangRecords
      .filter(r => r.createdAt.getMonth() === today.getMonth())
      .reduce((sum, r) => sum + r.amount, 0);

    return {
      totalSales,
      totalUtang,
      lowStockItems,
      totalCustomers,
      dailySales,
      monthlyUtang,
    };
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        customers,
        addCustomer,
        updateCustomer,
        transactions,
        addTransaction,
        utangRecords,
        addUtangRecord,
        addPayment,
        getDashboardStats,
        isLoading,
        error,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
