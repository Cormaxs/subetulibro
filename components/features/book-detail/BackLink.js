// components/features/book-detail/BackLink.js

import Link from 'next/link';
import styles from '../../../styles/BookDetail.module.css';

const BackLink = () => {
    return (
        <Link href="/" legacyBehavior>
            <a className={styles.backLink}>
                &larr; Volver al Catálogo
            </a>
        </Link>
    );
};

export default BackLink;