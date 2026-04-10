export interface AuthUser {
  name: string;
  email: string;
}

const AUTH_KEY = "deepfake_auth_user";

export const getAuthUser = (): AuthUser | null => {
  try {
    const data = localStorage.getItem(AUTH_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

export const login = (user: AuthUser) => {
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
};

export const logout = () => {
  localStorage.removeItem(AUTH_KEY);
};

export const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
};
