import { useState, useEffect } from 'react';
import type { Character } from '@/types/character';

export const useCharacterStore = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [characters, setCharacters] = useState<Character[]>([]);

    useEffect(() => {
        const loadCharacters = async () => {
            setLoading(true);
            setError(null);

            try {
                const data: Character[] = [ { id: 1, name: "Test1" }, { id: 2, name: "Test2" } ];
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