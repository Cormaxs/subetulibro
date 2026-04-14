import useAdminProtection from '../../../hooks/useAdminProtection';
import CreateBookForm from '../../../components/admin/CreateBookForm';
import Layout from '../../../components/layout/Layout';
import styles from '../../../styles/Admin.module.css';
import { useRouter } from 'next/router';

export default function CreateBookPage() {
  const { isAdmin, loading } = useAdminProtection();
  const router = useRouter();

  if (loading) {
    return (
      <Layout>
        <div className={styles.container}>
          <p>Verificando acceso...</p>
        </div>
      </Layout>
    );
  }

  if (!isAdmin) {
    return (
      <Layout>
        <div className={styles.container}>
          <p>No tienes permisos para acceder a esta página.</p>
        </div>
      </Layout>
    );
  }

  const handleBookCreated = (book) => {
    setTimeout(() => {
      router.push('/admin/books');
    }, 1500);
  };

  return (
    <Layout>
      <div className={styles.container}>
        <CreateBookForm onBookCreated={handleBookCreated} />
      </div>
    </Layout>
  );
}
