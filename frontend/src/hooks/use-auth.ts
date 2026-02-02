"use client";

import { useEffect, useState } from "react";
// We can use a more robust auth solution, but for now we follow the pattern in product-detail-client
// which checks for 'tatvivah_access' cookie.
// Ideally, we decoding the token to get user info. 
// Since we don't have a decoder library handy in dependencies list (maybe jwt-decode?), 
// We'll implemented a simple parse.

interface User {
    id: string;
    role: string;
    [key: string]: any;
}

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check cookie
        const match = document.cookie.match(/(?:^|; )tatvivah_access=([^;]*)/);
        const accessToken = match ? match[1] : null;

        if (accessToken) {
            setToken(accessToken);
            try {
                // Simple JWT decode (payload is 2nd part)
                const payload = JSON.parse(atob(accessToken.split('.')[1]));
                setUser(payload as User);
            } catch (e) {
                console.error("Failed to decode token", e);
                setUser(null);
            }
        } else {
            setToken(null);
            setUser(null);
        }
        setLoading(false);
    }, []);

    return { user, token, loading };
}
