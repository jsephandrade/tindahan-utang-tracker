
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Customer, Transaction, UtangRecord, Payment, DashboardStats } from '@/types/store';
import {
  getProducts,
  createProduct,
  updateProduct as updateProductApi,
  deleteProduct as deleteProductApi,
  getCustomers,
  createCustomer,
  updateCustomer as updateCustomerApi,
  deleteCustomer as deleteCustomerApi,
  getTransactions,
  createTransaction,
  updateTransaction as updateTransactionApi,
  deleteTransaction as deleteTransactionApi,
  getUtangRecords,
  createUtangRecord,
  updateUtangRecord as updateUtangRecordApi,
  deleteUtangRecord as deleteUtangRecordApi,
  createPayment,
  updatePayment as updatePaymentApi,
  deletePayment as deletePaymentApi,
} from '@/lib/api';

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
  deleteCustomer: (id: string) => void;
  
  // Transactions
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt'>) => void;
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  
  // Utang
  utangRecords: UtangRecord[];
  addUtangRecord: (record: Omit<UtangRecord, 'id' | 'createdAt'>) => void;
  updateUtangRecord: (id: string, updates: Partial<UtangRecord>) => void;
  deleteUtangRecord: (id: string) => void;
  addPayment: (utangId: string, amount: number, note?: string) => void;
  updatePayment: (id: string, updates: Partial<Payment>) => void;
  deletePayment: (id: string) => void;
  
  // Dashboard
  getDashboardStats: () => DashboardStats;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [utangRecords, setUtangRecords] = useState<UtangRecord[]>([]);

  useEffect(() => {
    getProducts().then(setProducts).catch(console.error);
    getCustomers().then(setCustomers).catch(console.error);
    getTransactions().then(setTransactions).catch(console.error);
    getUtangRecords()
      .then(records =>
        setUtangRecords(records.map(r => ({ ...r, payments: r.payments ?? [] })))
      )
      .catch(console.error);
  }, []);

  const addProduct = async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    const created = await createProduct(productData);
    setProducts(prev => [...prev, created as Product]);
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    const updated = await updateProductApi(id, updates);
    setProducts(prev =>
      prev.map(product => (product.id === id ? (updated as Product) : product))
    );
  };

  const deleteProduct = async (id: string) => {
    await deleteProductApi(id);
    setProducts(prev => prev.filter(product => product.id !== id));
  };

  const addCustomer = async (
    customerData: Omit<Customer, 'id' | 'createdAt' | 'totalUtang'>,
  ) => {
    const created = await createCustomer(customerData);
    setCustomers(prev => [...prev, created as Customer]);
  };

  const updateCustomer = async (id: string, updates: Partial<Customer>) => {
    const updated = await updateCustomerApi(id, updates);
    setCustomers(prev =>
      prev.map(customer => (customer.id === id ? (updated as Customer) : customer))
    );
  };

  const deleteCustomer = async (id: string) => {
    await deleteCustomerApi(id);
    setCustomers(prev => prev.filter(c => c.id !== id));
  };

  const addTransaction = async (
    transactionData: Omit<Transaction, 'id' | 'createdAt'>,
  ) => {
    const created = (await createTransaction(transactionData)) as Transaction;
    // DRF doesn't return the nested items or customer info, so merge them from
    // the data we already have to keep our local state consistent
    const transactionWithItems: Transaction = {
      ...created,
      items: transactionData.items,
      customerId: transactionData.customerId,
      customerName: transactionData.customerName,
    };
    setTransactions(prev => [...prev, transactionWithItems]);
    
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
        transactionId: created.id,
        amount: transactionData.utangAmount,
        description: `Purchase - ${transactionData.items.map(i => i.productName).join(', ')}`,
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        status: 'unpaid',
        payments: [],
      };
      addUtangRecord(utangRecord);
    }
  };

  const addUtangRecord = async (
    recordData: Omit<UtangRecord, 'id' | 'createdAt'>,
  ) => {
    const created = (await createUtangRecord(recordData)) as UtangRecord;
    setUtangRecords(prev => [
      ...prev,
      { ...created, payments: created.payments ?? [] },
    ]);

    const customer = customers.find(c => c.id === recordData.customerId);
    if (customer) {
      updateCustomer(customer.id, {
        totalUtang: customer.totalUtang + recordData.amount,
      });
    }
  };

  const addPayment = async (utangId: string, amount: number, note?: string) => {
    const created = (await createPayment({
      utang_record: utangId,
      amount,
      note,
      // Backend requires a date value for each payment
      date: new Date(),
    })) as Payment;
    setUtangRecords(prev =>
      prev.map(record => {
        if (record.id === utangId) {
          const currentPayments = record.payments ?? [];
          const totalPaid = [...currentPayments, created].reduce((sum, p) => sum + p.amount, 0);
          const status = totalPaid >= record.amount ? 'paid' : 'partial';
          
          // Update customer total utang
          const customer = customers.find(c => c.id === record.customerId);
          if (customer) {
            updateCustomer(customer.id, {
              totalUtang: customer.totalUtang - amount,
            });
          }

          return {
            ...record,
            payments: [...currentPayments, created],
            status: status as 'unpaid' | 'partial' | 'paid',
          };
        }
        return record;
      })
    );
  };

  const updateTransaction = async (id: string, updates: Partial<Transaction>) => {
    const updated = await updateTransactionApi(id, updates);
    setTransactions(prev => prev.map(t => (t.id === id ? (updated as Transaction) : t)));
  };

  const deleteTransaction = async (id: string) => {
    await deleteTransactionApi(id);
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const updateUtangRecord = async (id: string, updates: Partial<UtangRecord>) => {
    const updated = await updateUtangRecordApi(id, updates);
    setUtangRecords(prev =>
      prev.map(r => (r.id === id ? { ...r, ...updated } : r))
    );
  };

  const deleteUtangRecord = async (id: string) => {
    await deleteUtangRecordApi(id);
    setUtangRecords(prev => prev.filter(r => r.id !== id));
  };

  const updatePayment = async (id: string, updates: Partial<Payment>) => {
    const updated = await updatePaymentApi(id, updates);
    setUtangRecords(prev =>
      prev.map(record => ({
        ...record,
        payments: (record.payments ?? []).map(p =>
          p.id === id ? (updated as Payment) : p
        ),
      }))
    );
  };

  const deletePayment = async (id: string) => {
    await deletePaymentApi(id);
    setUtangRecords(prev =>
      prev.map(record => ({
        ...record,
        payments: (record.payments ?? []).filter(p => p.id !== id),
      }))
    );
  };

  const getDashboardStats = (): DashboardStats => {
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
      .filter(r => new Date(r.createdAt as any).getMonth() === today.getMonth())
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
        deleteCustomer,
        transactions,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        utangRecords,
        addUtangRecord,
        updateUtangRecord,
        deleteUtangRecord,
        addPayment,
        updatePayment,
        deletePayment,
        getDashboardStats,
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