import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/router';
import styles from '../../styles/SearchHeaderBar.module.css';
import { fetchBooks } from '../../services/llamados/books';
import { createSlug } from '../../utils/slug';
import { isValidImageUrl } from '../../utils/imageUtils';

const SearchHeaderBar = () => {
    const router = useRouter();
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [imageErrors, setImageErrors] = useState({}); // Estado para errores de imagen
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        fileType: '',
        category: '',
        author: '',
        language: '',
        isPremium: ''
    });
    const searchContainerRef = useRef(null);
    const timeoutRef = useRef(null);

    // Obtener sugerencias mientras el usuario escribe
    const getSuggestions = useCallback(async (searchTerm) => {
        // Permitir búsqueda si hay query o si hay filtros activos
        const hasQuery = searchTerm && searchTerm.trim() && searchTerm.length >= 2;
        const hasActiveFilters = Object.values(filters).some(v => v !== '');

        if (!hasQuery && !hasActiveFilters) {
            setSuggestions([]);
            setIsOpen(false);
            return;
        }

        setIsLoading(true);
        try {
            // Construir parámetros de búsqueda con filtros
            const searchParams = { limit: 8 };
            if (hasQuery) searchParams.q = searchTerm;
            if (filters.fileType) searchParams.fileType = filters.fileType;
            if (filters.category) searchParams.category = filters.category;
            if (filters.author) searchParams.author = filters.author;
            if (filters.language) searchParams.language = filters.language;
            if (filters.isPremium) searchParams.isPremium = filters.isPremium;

            const data = await fetchBooks(searchParams);
            const books = data.books || [];
            
            // Extraer libros únicos para mostrar como sugerencias
            const uniqueBooks = [];
            const seenIds = new Set();
            
            books.forEach(book => {
                if (!seenIds.has(book._id)) {
                    seenIds.add(book._id);
                    const slug = createSlug(book.titulo);
                    const uniqueSlug = `${slug}-${book._id}`;
                    
                    // Decodificar entidades HTML en la URL de la portada
                    const decodedPortada = book.portada ? book.portada.replace(/&amp;/g, '&') : '';
                    
                    uniqueBooks.push({
                        _id: book._id,
                        titulo: book.titulo,
                        autor: book.autor,
                        portada: decodedPortada,
                        slug: uniqueSlug
                    });
                }
            });
            
            setSuggestions(uniqueBooks);
            if (uniqueBooks.length > 0) {
                setIsOpen(true);
            }
        } catch (error) {
            console.error('Error fetching suggestions:', error);
            setSuggestions([]);
        } finally {
            setIsLoading(false);
        }
    }, [filters.author, filters.category, filters.fileType, filters.language, filters.isPremium]);

    // Búsqueda en tiempo real - sin debounce para reactividad inmediata
    useEffect(() => {
        if (query.trim().length >= 2) {
            getSuggestions(query);
        } else if (query.length === 0) {
            setSuggestions([]);
            setIsOpen(false);
        }
    }, [query, getSuggestions]);

    // Cerrar sugerencias cuando el usuario hace clic fuera
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearch = useCallback((e, searchQuery = query) => {
        e?.preventDefault();
        const trimmedQuery = searchQuery.trim();
        const hasActiveFilters = Object.values(filters).some(v => v !== '');

        // Permitir búsqueda si hay query o filtros activos
        if (!trimmedQuery && !hasActiveFilters) return;

        setIsOpen(false);
        setSuggestions([]);
        setQuery('');
        
        sessionStorage.removeItem('last_catalog_page');
        
        // Construir URL con filtros
        let url = '/?page=1&limit=12';
        if (trimmedQuery) url += `&q=${encodeURIComponent(trimmedQuery)}`;
        if (filters.fileType) url += `&fileType=${encodeURIComponent(filters.fileType)}`;
        if (filters.category) url += `&categorias=${encodeURIComponent(filters.category)}`;
        if (filters.author) url += `&autor=${encodeURIComponent(filters.author)}`;
        if (filters.language) url += `&idioma=${encodeURIComponent(filters.language)}`;
        if (filters.isPremium) url += `&isPremium=${encodeURIComponent(filters.isPremium)}`;
        
        router.push(url);
    }, [query, router, filters]);

    const handleViewAllResults = () => {
        const trimmedQuery = query.trim();
        const hasActiveFilters = Object.values(filters).some(v => v !== '');

        // Permitir búsqueda si hay query o filtros activos
        if (!trimmedQuery && !hasActiveFilters) return;

        setIsOpen(false);
        setSuggestions([]);
        setQuery('');
        
        sessionStorage.removeItem('last_catalog_page');
        
        // Construir URL con filtros
        let url = '/?page=1&limit=12';
        if (trimmedQuery) url += `&q=${encodeURIComponent(trimmedQuery)}`;
        if (filters.fileType) url += `&fileType=${encodeURIComponent(filters.fileType)}`;
        if (filters.category) url += `&category=${encodeURIComponent(filters.category)}`;
        if (filters.author) url += `&author=${encodeURIComponent(filters.author)}`;
        if (filters.language) url += `&language=${encodeURIComponent(filters.language)}`;
        if (filters.isPremium) url += `&isPremium=${encodeURIComponent(filters.isPremium)}`;
        
        router.push(url);
    };

    const handleSuggestionClick = (suggestion) => {
        setQuery('');
        setIsOpen(false);
        setSuggestions([]);
        // Abrir el libro directamente
        router.push(`/seeBook/${suggestion.slug}`);
    };

    const handleKeyDown = (e) => {
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setSelectedIndex(prev => 
                    prev < suggestions.length - 1 ? prev + 1 : 0
                );
                break;
            case 'ArrowUp':
                e.preventDefault();
                setSelectedIndex(prev => 
                    prev > 0 ? prev - 1 : suggestions.length - 1
                );
                break;
            case 'Enter':
                e.preventDefault();
                if (selectedIndex >= 0 && suggestions[selectedIndex]) {
                    handleSuggestionClick(suggestions[selectedIndex]);
                } else {
                    handleSearch(e);
                }
                break;
            case 'Escape':
                setIsOpen(false);
                setSelectedIndex(-1);
                break;
            default:
                break;
        }
    };

    const handleInputChange = (e) => {
        setQuery(e.target.value);
        setSelectedIndex(-1);
    };

    const handleClear = () => {
        setQuery('');
        setSuggestions([]);
        setIsOpen(false);
        setSelectedIndex(-1);
        setImageErrors({}); // Limpiar errores de imagen
    };

    const handleImageError = (bookId) => {
        setImageErrors(prev => ({
            ...prev,
            [bookId]: true
        }));
    };

    const handleFilterChange = (filterType, value) => {
        setFilters(prev => ({
            ...prev,
            [filterType]: value
        }));
    };

    const clearFilters = () => {
        setFilters({
            fileType: '',
            category: '',
            author: '',
            language: '',
            isPremium: ''
        });
    };

    const toggleFilters = () => {
        setShowFilters(!showFilters);
    };

    return (
        <div className={styles.searchContainer} ref={searchContainerRef}>
            <form className={styles.searchForm} onSubmit={handleSearch}>
                <div className={styles.inputWrapper}>
                    <input
                        type="text"
                        value={query}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        onFocus={() => query && suggestions.length > 0 && setIsOpen(true)}
                        placeholder="Buscar por libro, autor, filtros..."
                        className={styles.searchInput}
                        aria-label="Término de búsqueda"
                        autoComplete="off"
                    />
                    {query && (
                        <button
                            type="button"
                            onClick={handleClear}
                            className={styles.clearIcon}
                            aria-label="Limpiar búsqueda"
                            title="Limpiar"
                        >
                            ✕
                        </button>
                    )}
                </div>

                <button
                    type="submit"
                    className={styles.searchButton}
                    aria-label="Buscar"
                >
                    🔍
                </button>
                
                <button
                    type="button"
                    onClick={toggleFilters}
                    className={`${styles.filterButton} ${showFilters ? styles.filterButtonActive : ''}`}
                    aria-label="Mostrar filtros"
                    title="Filtros avanzados"
                >
                    ⚙️
                </button>
            </form>

            {/* FILTROS AVANZADOS */}
            {showFilters && (
                <div className={styles.filtersContainer}>
                    <div className={styles.filtersGrid}>
                        <div className={styles.filterGroup}>
                            <label htmlFor="fileType" className={styles.filterLabel}>
                                Formato
                            </label>
                            <select
                                id="fileType"
                                value={filters.fileType}
                                onChange={(e) => handleFilterChange('fileType', e.target.value)}
                                className={styles.filterSelect}
                            >
                                <option value="">Todos</option>
                                <option value="epub">EPUB</option>
                                <option value="pdf">PDF</option>
                                <option value="mobi">MOBI</option>
                                <option value="txt">TXT</option>
                            </select>
                        </div>
                        
                        <div className={styles.filterGroup}>
                            <label htmlFor="category" className={styles.filterLabel}>
                                Categoría
                            </label>
                            <input
                                type="text"
                                id="category"
                                value={filters.category}
                                onChange={(e) => handleFilterChange('category', e.target.value)}
                                placeholder="Ej: Romance, Ciencia Ficción..."
                                className={styles.filterInput}
                            />
                        </div>
                        
                        <div className={styles.filterGroup}>
                            <label htmlFor="author" className={styles.filterLabel}>
                                Autor
                            </label>
                            <input
                                type="text"
                                id="author"
                                value={filters.author}
                                onChange={(e) => handleFilterChange('author', e.target.value)}
                                placeholder="Nombre del autor..."
                                className={styles.filterInput}
                            />
                        </div>
                        
                        <div className={styles.filterGroup}>
                            <label htmlFor="language" className={styles.filterLabel}>
                                Idioma
                            </label>
                            <select
                                id="language"
                                value={filters.language}
                                onChange={(e) => handleFilterChange('language', e.target.value)}
                                className={styles.filterSelect}
                            >
                                <option value="">Todos</option>
                                <option value="es">Español</option>
                                <option value="en">Inglés</option>
                                <option value="fr">Francés</option>
                                <option value="pt">Portugués</option>
                                <option value="de">Alemán</option>
                                <option value="it">Italiano</option>
                                <option value="ja">Japonés</option>
                                <option value="zh">Chino</option>
                            </select>
                        </div>
                        
                        <div className={styles.filterGroup}>
                            <label htmlFor="isPremium" className={styles.filterLabel}>
                                Tipo
                            </label>
                            <select
                                id="isPremium"
                                value={filters.isPremium}
                                onChange={(e) => handleFilterChange('isPremium', e.target.value)}
                                className={styles.filterSelect}
                            >
                                <option value="">Todos</option>
                                <option value="true">Solo Premium</option>
                                <option value="false">Solo Gratis</option>
                            </select>
                        </div>
                    </div>
                    
                    <div className={styles.filterActions}>
                        <button
                            type="button"
                            onClick={clearFilters}
                            className={styles.clearFiltersButton}
                        >
                            Limpiar filtros
                        </button>
                    </div>
                </div>
            )}

            {/* SUGERENCIAS DROPDOWN */}
            {isOpen && suggestions.length > 0 && (
                <div className={styles.suggestionsContainer}>
                    <div className={styles.suggestionsWrapper}>
                        <ul className={styles.suggestionsDropdown}>
                            {suggestions.map((suggestion, index) => (
                                <li key={suggestion._id}>
                                    <button
                                        type="button"
                                        onClick={() => handleSuggestionClick(suggestion)}
                                        className={`${styles.suggestionItem} ${
                                            index === selectedIndex ? styles.selected : ''
                                        }`}
                                    >
                                        {isValidImageUrl(suggestion.portada) && !imageErrors[suggestion._id] ? (
                                            <img 
                                                src={suggestion.portada} 
                                                alt={suggestion.titulo}
                                                className={styles.bookCover}
                                                loading="lazy"
                                                onError={() => handleImageError(suggestion._id)}
                                            />
                                        ) : (
                                            <div className={styles.bookCoverPlaceholder}>
                                                📕
                                            </div>
                                        )}
                                        <div className={styles.suggestionContent}>
                                            <div className={styles.suggestionTitle}>
                                                {suggestion.titulo}
                                            </div>
                                            {suggestion.autor && (
                                                <div className={styles.suggestionAuthor}>
                                                    {suggestion.autor}
                                                </div>
                                            )}
                                        </div>
                                    </button>
                                </li>
                            ))}
                        </ul>
                        <button
                            type="button"
                            onClick={handleViewAllResults}
                            className={styles.viewAllButton}
                        >
                            Ver todos los resultados
                        </button>
                    </div>
                </div>
            )}

            {/* ESTADO DE CARGA */}
            {isLoading && query.length >= 2 && (
                <div className={styles.loadingMessage}>
                    Buscando...
                </div>
            )}
        </div>
    );
};

export default SearchHeaderBar;
