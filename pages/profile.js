import SEO from '../components/seo/SEO';
import BreadcrumbSchema from '../components/seo/BreadcrumbSchema';
import { useState } from 'react';
import Layout from '../components/layout/Layout';
import useAuth from '../hooks/useAuth';
import EditProfileForm from '../components/features/EditProfileForm';
import styles from '../styles/Profile.module.css';

export default function Profile() {
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const { user } = useAuth();

    const handleProfileUpdated = (updatedUser) => {
        setIsEditingProfile(false);
        // Guardar el user actualizado en localStorage
        if (updatedUser) {
            localStorage.setItem('user', JSON.stringify(updatedUser));
        }
    };

    const breadcrumbs = [
        { name: 'Inicio', url: 'https://subetulibro.com' },
        { name: 'Mi Perfil', url: 'https://subetulibro.com/profile' },
    ];

    return (
        <Layout>
            <SEO
                title="Mi Perfil - SubeTuLibro | Gestiona tu Cuenta"
                description="Administra tu perfil en SubeTuLibro. Edita tu información personal, contraseña y email."
                canonical="https://subetulibro.com/profile"
                keywords="perfil, mi cuenta, editar perfil, configuración"
            >
                <BreadcrumbSchema items={breadcrumbs} />
            </SEO>

            {!user ? (
                <div className={styles.profileContainer}>
                    <div className={styles.noUserMessage}>
                        <p>Por favor, inicia sesión para ver tu perfil.</p>
                    </div>
                </div>
            ) : (
                <div className={styles.profileContainer}>
                    {/* Header del Perfil */}
                    <div className={styles.profileHeader}>
                        <div className={styles.avatarSection}>
                            <div className={styles.avatar}>
                                <span>👤</span>
                            </div>
                            <div className={styles.userInfo}>
                                <h1 className={styles.username}>{user?.username || 'Usuario'}</h1>
                                <p className={styles.userEmail}>{user?.email || 'email@example.com'}</p>
                                <span className={styles.memberBadge}>
                                    {user?.planType === 'free' ? '📖 Usuario Libre' : user?.planType === 'lector' ? '📚 Lector' : '🏆 Erudito'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Contenido del Perfil */}
                    <div className={styles.tabsContent}>
                        <section className={styles.section}>
                            {!isEditingProfile ? (
                                <div className={styles.card}>
                                    <h2 className={styles.cardTitle}>Información Personal</h2>
                                    <div className={styles.infoGrid}>
                                        <div className={styles.infoItem}>
                                            <label>Nombre de Usuario</label>
                                            <p>{user?.username}</p>
                                        </div>
                                        <div className={styles.infoItem}>
                                            <label>Email</label>
                                            <p>{user?.email || 'No especificado'}</p>
                                        </div>
                                        <div className={styles.infoItem}>
                                            <label>Plan Actual</label>
                                            <p>{user?.planType === 'free' ? 'Gratis' : user?.planType === 'lector' ? 'Lector' : 'Erudito'}</p>
                                        </div>
                                    </div>
                                    <button
                                        className={styles.btnPrimary}
                                        onClick={() => setIsEditingProfile(true)}
                                    >
                                        Editar Perfil
                                    </button>
                                </div>
                            ) : (
                                <EditProfileForm
                                    user={user}
                                    onProfileUpdated={handleProfileUpdated}
                                    onCancel={() => setIsEditingProfile(false)}
                                />
                            )}
                        </section>
                    </div>
                </div>
            )}
        </Layout>
    );
}
