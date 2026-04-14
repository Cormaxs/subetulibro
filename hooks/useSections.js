// hooks/useSections.js

import { useState, useEffect } from 'react';
import { fetchBooks } from '../services/llamados/books';

const SECTION_CONFIG = [
    { key: 'jkRowling', params: { autor: 'J.K. Rowling' } },
    { key: 'novels', params: { categorias: 'novelas' } },
    { key: 'suspenso', params: { autor: 'Stephen King' } },
    { key: 'garciaMarquez', params: { autor: 'Gabriel García' } },
];

const sectionCache = {};

const useSections = () => {
    const initialState = SECTION_CONFIG.reduce((acc, section) => {
        acc[section.key] = {
            books: sectionCache[section.key]?.books || [],
            isLoading: sectionCache[section.key] ? false : true,
            error: sectionCache[section.key]?.error || null,
        };
        return acc;
    }, {});

    const [sections, setSections] = useState(initialState);

    useEffect(() => {
        const loadSections = async () => {
            await Promise.allSettled(
                SECTION_CONFIG.map(async (section) => {
                    if (sectionCache[section.key]) {
                        setSections(prev => ({
                            ...prev,
                            [section.key]: sectionCache[section.key]
                        }));
                        return;
                    }

                    try {
                        const data = await fetchBooks({ ...section.params, limit: 20 });
                        const value = {
                            books: data.books || [],
                            isLoading: false,
                            error: null
                        };
                        sectionCache[section.key] = value;
                        setSections(prev => ({
                            ...prev,
                            [section.key]: value
                        }));
                    } catch (error) {
                        const value = {
                            books: [],
                            isLoading: false,
                            error: error.message
                        };
                        sectionCache[section.key] = value;
                        setSections(prev => ({
                            ...prev,
                            [section.key]: value
                        }));
                    }
                })
            );
        };

        loadSections();
    }, []);

    return sections;
};

export default useSections;