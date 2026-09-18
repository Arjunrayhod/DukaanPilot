export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export async function checkHealth() {
  try {
    const res = await fetch(`${API_BASE_URL}/health`);
    return await res.json();
  } catch (err: any) {
    return { success: false, error: { message: err.message } };
  }
}

export async function loginUser(phone: string, pinOrPassword: string, isPin = true) {
  const payload = isPin ? { phone, pin: pinOrPassword } : { phone, password: pinOrPassword };
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return await res.json();
}

export async function registerOwner(data: {
  phone: string;
  name: string;
  password: string;
  shopName: string;
  pin?: string;
}) {
  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return await res.json();
}
