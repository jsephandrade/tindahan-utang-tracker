import type {
  Customer,
  Payment,
  Product,
  Transaction,
  UtangRecord,
} from '@/types/store';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${url}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    throw new Error(`Request failed: ${res.status}`);
  }
  const data = await res.json();
  return camelize(data) as T;
}

function camelize(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(camelize);
  }
  if (obj && typeof obj === 'object') {
    return Object.fromEntries(
      Object.entries(obj).map(([k, v]) => [
        k.replace(/_([a-z])/g, (_, c) => c.toUpperCase()),
        camelize(v),
      ]),
    );
  }
  return obj;
}

export function getProducts() {
  return request<Product[]>('/products/');
}

export function createProduct(data: Partial<Product>) {
  return request<Product>('/products/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateProduct(id: string, data: Partial<Product>) {
  return request<Product>(`/products/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function deleteProduct(id: string) {
  return request<void>(`/products/${id}/`, { method: 'DELETE' });
}

export function getCustomers() {
  return request<Customer[]>('/customers/');
}

export function createCustomer(data: Partial<Customer>) {
  return request<Customer>('/customers/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateCustomer(id: string, data: Partial<Customer>) {
  return request<Customer>(`/customers/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function deleteCustomer(id: string) {
  return request<void>(`/customers/${id}/`, { method: 'DELETE' });
}

export function getTransactions() {
  return request<Transaction[]>('/transactions/');
}

export function createTransaction(data: Partial<Transaction>) {
  return request<Transaction>('/transactions/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateTransaction(id: string, data: Partial<Transaction>) {
  return request<Transaction>(`/transactions/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function deleteTransaction(id: string) {
  return request<void>(`/transactions/${id}/`, { method: 'DELETE' });
}

export function getUtangRecords() {
  return request<UtangRecord[]>('/utang-records/');
}

export function createUtangRecord(data: Partial<UtangRecord>) {
  return request<UtangRecord>('/utang-records/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateUtangRecord(id: string, data: Partial<UtangRecord>) {
  return request<UtangRecord>(`/utang-records/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function deleteUtangRecord(id: string) {
  return request<void>(`/utang-records/${id}/`, { method: 'DELETE' });
}

export function getPayments() {
  return request<Payment[]>('/payments/');
}

export function createPayment(data: Partial<Payment>) {
  return request<Payment>('/payments/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updatePayment(id: string, data: Partial<Payment>) {
  return request<Payment>(`/payments/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function deletePayment(id: string) {
  return request<void>(`/payments/${id}/`, { method: 'DELETE' });
}