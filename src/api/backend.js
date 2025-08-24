const backendURL = import.meta.env.VITE_API_BASE_URL;

export async function registerUser(username, password) {
  try {
    const response = await fetch(`${backendURL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
      credentials: 'include'
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch:', error);
    throw error;
  }
}
