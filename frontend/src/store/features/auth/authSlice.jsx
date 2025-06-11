import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

import { setLoading } from "../loading/loadingSlice";

export const loginUser = createAsyncThunk(
    "auth/loginUser",
    async (form, { rejectWithValue, dispatch }) => {
        try {
            dispatch(setLoading(true))
            const response = await axios.post("http://localhost:3000/api/auth/login", form);
            console.log(response)
            const { token } = response.data;
            if (token) {
                const { id, email, role } = jwtDecode(token);

                localStorage.setItem("token", token);
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                return ({ id, email, role });
            } else {
                return rejectWithValue("No token in response");
            }
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Login failed");
        } finally {
            setTimeout(() => {dispatch(setLoading(false));}, 300);
        }
    }
);

const initialState = {
    isLoggedIn: false,
    userData: null,
}
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.isLoggedIn = false;
            state.userData = null;
            localStorage.removeItem("token");
            delete axios.defaults.headers.common['Authorization'];
        },
        restoreLogin: (state, action) => {
            state.isLoggedIn = true;
            state.userData = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(loginUser.pending, (state) => {
            state.isLoggedIn = false;
        }).addCase(loginUser.fulfilled, (state, action) => {
            state.isLoggedIn = true;
            state.userData = action.payload;
        }).addCase(loginUser.rejected, (state, payload) => {
            state.isLoggedIn = false;
        })
    }
});

export const { logout, restoreLogin } = authSlice.actions;
export default authSlice.reducer;