export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  
  const headers = new Headers(options.headers || {});
  
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  
  // If the body is FormData, don't set Content-Type as the browser will set it with boundary
  if (!(options.body instanceof FormData)) {
      if (!headers.has('Content-Type') && options.method && options.method !== 'GET') {
          headers.set('Content-Type', 'application/json');
      }
  }

  const res = await fetch(url, { ...options, headers });
  
  if (res.status === 401) {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
  }
  
  return res;
}
