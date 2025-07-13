import type {
  Customer,
  Payment,
  Product,
  Transaction,
  UtangRecord,
} from '@/types/store';

const BASE_URL =
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_API_URL_PROD ||
  'http://localhost:8080/api';

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
  return convertNumbers(camelize(data)) as T;
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

function decamelize(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(decamelize);
  }
  if (obj && typeof obj === 'object') {
    return Object.fromEntries(
      Object.entries(obj)
        .filter(([, v]) => v !== undefined)
        .map(([k, v]) => [
          k
            .replace(/([A-Z])/g, '_$1')
            .toLowerCase(),
          decamelize(v),
        ])
    );
  }
  return obj;
}

// Convert numeric strings for known numeric fields to actual numbers
const numericKeyPattern = /(price|amount|total|stock|quantity|utang|sales|paid|change|balance)/i;
// Recognize date-like keys to convert ISO strings to Date objects
const dateKeyPattern = /(date|createdAt|updatedAt|due|dueDate|lastTransaction)/i;

function convertNumbers(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(convertNumbers);
  }
  if (obj && typeof obj === 'object') {
    return Object.fromEntries(
      Object.entries(obj).map(([k, v]) => [k, convertNumbers(convertValue(k, v))])
    );
  }
  return obj;
}

function convertValue(key: string, value: any) {
  if (typeof value === 'string') {
    if (numericKeyPattern.test(key)) {
      const num = parseFloat(value);
      if (!isNaN(num)) {
        return num;
      }
    }
    if (dateKeyPattern.test(key) && !isNaN(Date.parse(value))) {
      return new Date(value);
    }
  }
  return value;
}


export function getProducts() {
  return request<Product[]>('/products/');
}

export function createProduct(data: Partial<Product>) {
  return request<Product>('/products/', {
    method: 'POST',
    body: JSON.stringify(decamelize),
  });
}

export function updateProduct(id: string, data: Partial<Product>) {
  return request<Product>(`/products/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(decamelize),
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
    body: JSON.stringify(decamelize),
  });
}

export function updateCustomer(id: string, data: Partial<Customer>) {
  return request<Customer>(`/customers/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(decamelize(data)),
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
    body: JSON.stringify(decamelize),
  });
}

export function updateTransaction(id: string, data: Partial<Transaction>) {
  return request<Transaction>(`/transactions/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(decamelize(data)),
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
    body: JSON.stringify(decamelize(data)),
  });
}

export function updateUtangRecord(id: string, data: Partial<UtangRecord>) {
  return request<UtangRecord>(`/utang-records/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(decamelize(data)),
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
    body: JSON.stringify(decamelize(data)),
  });
}

export function updatePayment(id: string, data: Partial<Payment>) {
  return request<Payment>(`/payments/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(decamelize(data)),
  });
}

export function deletePayment(id: string) {
  return request<void>(`/payments/${id}/`, { method: 'DELETE' });
}