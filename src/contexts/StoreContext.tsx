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
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

// Sample data for demonstration
const sampleProducts: Product[] = [
  {
    id: '1',
    name: 'Lucky Me Instant Noodles',
    category: 'Instant Food',
    price: 15,
    stock: 50,
    minStock: 10,
    barcode: '123456789',
    supplier: 'Monde Nissin',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    name: 'Coca-Cola 250ml',
    category: 'Beverages',
    price: 20,
    stock: 30,
    minStock: 5,
    supplier: 'Coca-Cola Philippines',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    name: 'Skyflakes Crackers',
    category: 'Snacks',
    price: 25,
    stock: 8,
    minStock: 10,
    supplier: 'M.Y. San Corp',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const sampleCustomers: Customer[] = [
  {
    id: '1',
    name: 'Maria Santos',
    address: '123 Barangay Street',
    phone: '09123456789',
    totalUtang: 150,
    createdAt: new Date(),
  },
  {
    id: '2',
    name: 'Juan Dela Cruz',
    address: '456 Sitio Road',
    phone: '09987654321',
    totalUtang: 75,
    createdAt: new Date(),
  },
];

// Add sample transactions with utang
const sampleTransactions: Transaction[] = [
  {
    id: '1',
    customerId: '1',
    customerName: 'Maria Santos',
    items: [
      {
        productId: '1',
        productName: 'Lucky Me Instant Noodles',
        quantity: 2,
        price: 15,
        total: 30,
      },
      {
        productId: '2',
        productName: 'Coca-Cola 250ml',
        quantity: 3,
        price: 20,
        total: 60,
      },
    ],
    totalAmount: 90,
    amountPaid: 0,
    change: 0,
    utangAmount: 90,
    paymentMethod: 'utang',
    createdAt: new Date(),
    status: 'completed',
  },
  {
    id: '2',
    customerId: '2',
    customerName: 'Juan Dela Cruz',
    items: [
      {
        productId: '3',
        productName: 'Skyflakes Crackers',
        quantity: 1,
        price: 25,
        total: 25,
      },
      {
        productId: '1',
        productName: 'Lucky Me Instant Noodles',
        quantity: 1,
        price: 15,
        total: 15,
      },
    ],
    totalAmount: 40,
    amountPaid: 0,
    change: 0,
    utangAmount: 40,
    paymentMethod: 'utang',
    createdAt: new Date(),
    status: 'completed',
  },
];

// Add sample utang records
const sampleUtangRecords: UtangRecord[] = [
  {
    id: '1',
    customerId: '1',
    customerName: 'Maria Santos',
    transactionId: '1',
    amount: 90,
    description: 'Purchase - Lucky Me Instant Noodles, Coca-Cola 250ml',
    status: 'unpaid',
    payments: [],
    createdAt: new Date(),
  },
  {
    id: '2',
    customerId: '2',
    customerName: 'Juan Dela Cruz',
    transactionId: '2',
    amount: 40,
    description: 'Purchase - Skyflakes Crackers, Lucky Me Instant Noodles',
    status: 'partial',
    payments: [
      {
        id: '1',
        amount: 15,
        date: new Date(),
        note: 'Partial payment',
      },
    ],
    createdAt: new Date(),
  },
];

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(sampleProducts);
  const [customers, setCustomers] = useState<Customer[]>(sampleCustomers);
  const [transactions, setTransactions] = useState<Transaction[]>(sampleTransactions);
  const [utangRecords, setUtangRecords] = useState<UtangRecord[]>(sampleUtangRecords);

  const addProduct = (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProduct: Product = {
      ...productData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setProducts(prev => [...prev, newProduct]);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev =>
      prev.map(product =>
        product.id === id
          ? { ...product, ...updates, updatedAt: new Date() }
          : product
      )
    );
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(product => product.id !== id));
  };

  const addCustomer = (customerData: Omit<Customer, 'id' | 'createdAt' | 'totalUtang'>) => {
    const newCustomer: Customer = {
      ...customerData,
      id: Date.now().toString(),
      totalUtang: 0,
      createdAt: new Date(),
    };
    setCustomers(prev => [...prev, newCustomer]);
  };

  const updateCustomer = (id: string, updates: Partial<Customer>) => {
    setCustomers(prev =>
      prev.map(customer =>
        customer.id === id ? { ...customer, ...updates } : customer
      )
    );
  };

  const addTransaction = (transactionData: Omit<Transaction, 'id' | 'createdAt'>) => {
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
  };

  const addUtangRecord = (recordData: Omit<UtangRecord, 'id' | 'createdAt'>) => {
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
  };

  const addPayment = (utangId: string, amount: number, note?: string) => {
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
