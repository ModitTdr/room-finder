const API = import.meta.env.VITE_API_URL;
export const getProfile = async () => {
    try {
        const res = await fetch(`${API}/users/me`, {
            method: "GET",
            credentials: "include",
        });
        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.message || "Login failed");
        }
        return res.json();
    } catch {

    }
}