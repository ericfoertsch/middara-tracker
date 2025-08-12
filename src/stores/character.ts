import { useState, useEffect } from 'react';
import type { Character } from '@/types/character';
import adventurers from "@/assets/data/AdventurersTest.json";

export const useCharacterStore = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [characters, setCharacters] = useState<Character[]>([]);

    useEffect(() => {
        const loadCharacters = async () => {
            setLoading(true);
            setError(null);

            try {
                const data: Character[] = adventurers;
                setCharacters(data);
            } catch (err) {
                setError('Failed to fetch all convention series data: ' + err);
            } finally {
                setLoading(false);
            }
        };

        loadCharacters();
    }, []);

    return { characters, loading, error };
}