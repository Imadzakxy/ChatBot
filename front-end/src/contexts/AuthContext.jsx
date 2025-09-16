import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          if (parsedUser.token) {
            // Verify token with backend
            const response = await axios.get('http://localhost:3000/auth/verify', {
              headers: {
                Authorization: `Bearer ${parsedUser.token}`
              }
            });
            if (response.status === 200) {
              setUser(parsedUser);
            } else {
              localStorage.removeItem('user');
              setUser(null);
            }
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('user');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (username, password) => {
    try {
      const response = await axios.post('http://localhost:3000/auth/login', {
        username,
        password
      });

      if (response.status === 200) {
        const userData = {
          username,
          token: response.data.token,
          isAuthenticated: true
        };
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        return { success: true };
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.msg || 'Login failed. Please try again.'
      };
    }
  };

  const signup = async (username, email, password, confirmPassword) => {
    try {
      const response = await axios.post('http://localhost:3000/auth/register', {
        username,
        email,
        password,
        confirmPassword
      });

      if (response.status === 201) {
        return { success: true };
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.msg || 'Registration failed. Please try again.'
      };
    }
  };

  const logout = async () => {
    try {
      if (user?.token) {
        await axios.post('http://localhost:3000/auth/logout', {}, {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('user');
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
} 