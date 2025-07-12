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
  return res.json() as Promise<T>;
}

export function getProducts() {
  return request('/products/');
}

export function createProduct(data: Partial<any>) {
  return request('/products/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateProduct(id: string, data: Partial<any>) {
  return request(`/products/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function deleteProduct(id: string) {
  return request(`/products/${id}/`, { method: 'DELETE' });
}

export function getCustomers() {
  return request('/customers/');
}

export function createCustomer(data: Partial<any>) {
  return request('/customers/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateCustomer(id: string, data: Partial<any>) {
  return request(`/customers/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function deleteCustomer(id: string) {
  return request(`/customers/${id}/`, { method: 'DELETE' });
}

export function getTransactions() {
  return request('/transactions/');
}

export function createTransaction(data: Partial<any>) {
  return request('/transactions/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateTransaction(id: string, data: Partial<any>) {
  return request(`/transactions/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function deleteTransaction(id: string) {
  return request(`/transactions/${id}/`, { method: 'DELETE' });
}

export function getUtangRecords() {
  return request('/utang-records/');
}

export function createUtangRecord(data: Partial<any>) {
  return request('/utang-records/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateUtangRecord(id: string, data: Partial<any>) {
  return request(`/utang-records/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function deleteUtangRecord(id: string) {
  return request(`/utang-records/${id}/`, { method: 'DELETE' });
}

export function getPayments() {
  return request('/payments/');
}

export function createPayment(data: Partial<any>) {
  return request('/payments/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updatePayment(id: string, data: Partial<any>) {
  return request(`/payments/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function deletePayment(id: string) {
  return request(`/payments/${id}/`, { method: 'DELETE' });
}
