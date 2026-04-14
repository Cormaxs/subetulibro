import { useRouter } from 'next/router';
import { useEffect } from 'react';
import useAuth from './useAuth';

const useAdminProtection = () => {
  const router = useRouter();
  const { user, isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated || !user || user.role !== 'admin') {
      router.push('/');
    }
  }, [isAuthenticated, user, loading, router]);

  return { isAdmin: user?.role === 'admin', loading, user };
};

export default useAdminProtection;
