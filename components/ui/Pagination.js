// components/ui/Pagination.js

import Link from 'next/link';
import { getPaginationRange } from '../../utils/pagination';
import styles from '../../styles/Pagination.module.css';

const Pagination = ({ currentPage, totalPages, currentQuery, isLoading }) => {
    const paginationRange = getPaginationRange(currentPage, totalPages, 5);

    return (
        <div className={styles.paginationContainer}>
            {paginationRange.map((item, index) => {
                const key = `${item.type}-${item.number || index}`;

                if (item.type === 'ellipsis') {
                    return <span key={key} className={styles.ellipsis} aria-hidden="true">{item.label}</span>;
                }

                const isCurrent = item.number === currentPage;
                const isNavigation = item.type === 'prev' || item.type === 'next';

                const isDisabled = (item.type === 'prev' && currentPage === 1) ||
                                     (item.type === 'next' && currentPage === totalPages);

                const newHref = currentQuery
                    ? `/?q=${encodeURIComponent(currentQuery)}&page=${item.number}`
                    : `/?page=${item.number}`;

                if (isDisabled) {
                    return (
                        <span
                            key={key}
                            className={`${styles.paginationLink} ${isNavigation ? styles.navigation : ''} ${styles.disabled}`}
                            aria-disabled="true"
                        >
                            {item.label || item.number}
                        </span>
                    );
                }

                return (
                    <Link
                        key={key}
                        href={newHref}
                        legacyBehavior
                        prefetch={!isCurrent && item.type === 'page'}
                    >
                        <a
                            onClick={(e) => isLoading ? e.preventDefault() : null}
                            className={`${styles.paginationLink} ${isCurrent ? styles.current : ''} ${isNavigation ? styles.navigation : ''} ${isLoading ? styles.loadingLink : ''}`}
                            aria-current={isCurrent ? "page" : undefined}
                        >
                            {item.label || item.number}
                        </a>
                    </Link>
                );
            })}
        </div>
    );
};

export default Pagination;