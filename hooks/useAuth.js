import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (token) {
      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        
        if (decoded.exp > currentTime) {
          // Parseamos el user almacenado en localStorage si existe
          let userFromStorage = null;
          if (storedUser) {
            try {
              userFromStorage = JSON.parse(storedUser);
            } catch (e) {
              console.warn('No se pudo parsear user de localStorage:', e);
            }
          }

          // Combinamos datos del JWT (confiables para identidad) + localStorage (datos actualizados)
          const userData = {
            // Datos críticos del JWT (identidad y seguridad)
            _id: decoded.id,
            id: decoded.id,
            role: decoded.role,
            plan: decoded.plan,
            planType: decoded.planType,
            isSubscribed: decoded.isSubscribed,
            
            // Datos que pueden cambiar (usar localStorage si está disponible, sino del JWT)
            username: userFromStorage?.username || decoded.username,
            email: userFromStorage?.email || decoded.email,
            
            // Otros campos opcionales de localStorage si existen
            favoritos: userFromStorage?.favoritos || [],
            createdAt: userFromStorage?.createdAt || decoded.createdAt,
            updatedAt: userFromStorage?.updatedAt || decoded.updatedAt,
            subscriptionStatus: userFromStorage?.subscriptionStatus || decoded.subscriptionStatus,
          };

          setUser(userData);
          setIsAuthenticated(true);
        } else {
          // Token expirado, limpiar
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      } catch (error) {
        console.error('Error decodificando token:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    } else if (storedUser) {
      // Si no hay token pero hay user en localStorage, limpiarlo
      localStorage.removeItem('user');
    }
    
    setLoading(false);
  }, []);

  return { user, isAuthenticated, loading };
};

export default useAuth;