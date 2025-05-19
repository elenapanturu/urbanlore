import { createContext, useState, useEffect } from 'react';

export const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  function loginUser(newToken) {
    setToken(newToken);
    localStorage.setItem('token', newToken);
  }

  function logoutUser() {
    setToken(null);
    localStorage.removeItem('token');
    window.location.reload();
  }

  return (
    <UserContext.Provider value={{ token, loginUser, logoutUser }}>
      {children}
    </UserContext.Provider>
  );
}
