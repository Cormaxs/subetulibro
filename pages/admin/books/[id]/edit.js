import { useRouter } from 'next/router';
import useAdminProtection from '../../../../hooks/useAdminProtection';
import EditBookForm from '../../../../components/admin/EditBookForm';
import Layout from '../../../../components/layout/Layout';
import styles from '../../../../styles/Admin.module.css';

export default function EditBookPage() {
  const { isAdmin, loading } = useAdminProtection();
  const router = useRouter();
  const { id } = router.query;

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

  if (!id) {
    return (
      <Layout>
        <div className={styles.container}>
          <p>Cargando...</p>
        </div>
      </Layout>
    );
  }

  const handleBookUpdated = () => {
    setTimeout(() => {
      router.push('/admin/books');
    }, 1500);
  };

  return (
    <Layout>
      <div className={styles.container}>
        <EditBookForm bookId={id} onBookUpdated={handleBookUpdated} />
      </div>
    </Layout>
  );
}
