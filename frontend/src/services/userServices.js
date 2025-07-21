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

        const data = await res.json();

        if (data.message === "Phone number already exists" ||
            data.message === "Citizenship ID already exists") {
            const error = new Error(data.message);
            error.response = { data };
            throw error;
        }
        if (!res.ok) {
            const error = new Error(data.message || "Nothing updated");
            error.response = { data };
            throw error;
        }

        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}