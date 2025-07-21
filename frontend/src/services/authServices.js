
import axios from "axios";
const API = import.meta.env.VITE_API_URL

export async function loginUser(formData) {
    try {
        const res = await fetch(`${API}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify(formData)
        });
        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.message || "Login failed");
        }
        return res.json();
    } catch (error) {
        console.error("Auth check network error:", error);
        throw error;
    }

}

export async function signupUser(formData) {
    const res = await fetch(`${API}/auth/signup`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include", // for cookies
        body: JSON.stringify(formData)
    });

    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Signup failed");
    }

    return res.json();
}

export async function checkAuth() {
    try {
        const res = await fetch(`${API}/auth/check`, {
            method: "GET",
            credentials: "include",
        });
        if (!res.ok) {
            return { user: null };
        }
        return res.json();
    } catch (error) {
        console.warn("Auth check network error:", error);
        return { user: null };
    }
}

export async function logoutUser() {
    const res = await fetch(`${API}/auth/logout`, {
        method: "POST",
        credentials: "include",
    });

    if (!res.ok) {
        throw new Error("Logout failed");
    }

    return res.json();
}

export const forgotPasswordRequest = (email) =>
    axios.post(`${API}/auth/forgot-password`, { email });

export const resetPassword = ({ id, token, newPassword }) =>
    axios.post(`${API}/auth/reset-password`, { id, token, newPassword });
