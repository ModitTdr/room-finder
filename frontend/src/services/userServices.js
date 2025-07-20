const API = import.meta.env.VITE_API_URL;
export const getUser = async () => {
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
export const getUserProfile = async () => {
    try {
        const res = await fetch(`${API}/users/me/userprofile`, {
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
export const updateUserProfile = async (formData) => {
    try {
        const res = await fetch(`${API}/users/me/userprofile`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify(formData),
        });
        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.message || "Nothing updated");
        }
        return res.json();
    } catch (error) {
        console.error(error)
        throw error;
    }
}