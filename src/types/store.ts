
export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  minStock: number;
  barcode?: string;
  supplier?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Customer {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  totalUtang: number;
  createdAt: Date;
  lastTransaction?: Date;
}

export interface Transaction {
  id: string;
  customerId?: string;
  customerName?: string;
  items: TransactionItem[];
  totalAmount: number;
  amountPaid: number;
  change: number;
  utangAmount: number;
  paymentMethod: 'cash' | 'utang' | 'partial';
  createdAt: Date;
  status: 'completed' | 'pending';
}

export interface TransactionItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  total: number;
}

export interface UtangRecord {
  id: string;
  customerId: string;
  customerName: string;
  transactionId: string;
  amount: number;
  description: string;
  dueDate?: Date;
  status: 'unpaid' | 'partial' | 'paid';
  payments: Payment[];
  createdAt: Date;
}

export interface Payment {
  id: string;
  utang_record?: string;
  utangRecord?: string; // For backward compatibility
  amount: number;
  date: Date;
  note?: string;
}

export interface DashboardStats {
  totalSales: number;
  totalUtang: number;
  lowStockItems: number;
  totalCustomers: number;
  dailySales: number;
  monthlyUtang: number;
}
