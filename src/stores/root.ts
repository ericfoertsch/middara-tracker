import { useState, useEffect } from 'react';

export const useRootStore = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadRoot = async () => {
            setLoading(true);
            setError(null);
            setLoading(false);
        };

        loadRoot();
    }, []);

    return { loading, error };
}