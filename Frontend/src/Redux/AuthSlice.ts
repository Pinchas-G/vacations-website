import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import UserModel from "../Models/UserModel";
import jwtDecode from "jwt-decode";

interface AuthState {
    token: string;
    user: UserModel;
}

const initialState: AuthState = {
    token: localStorage.getItem('token'),
    user: null
}

if (initialState.token) {
    const container: { user: UserModel } = jwtDecode(initialState.token);
    initialState.user = container.user;   
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        register: (state, action: PayloadAction<string>) => {
            const token = action.payload;
            const container: { user: UserModel } = jwtDecode(token);
            state.token = token;
            state.user = container.user;
            localStorage.setItem('token', token);
        },

        login: (state, action: PayloadAction<string>) => {
            const token = action.payload;
            const container: { user: UserModel } = jwtDecode(token);
            state.token = token;
            state.user = container.user;
            localStorage.setItem('token', token);
        },

        logout: (state) => {
            state.token = null;
            state.user = null;
            localStorage.removeItem('token');
        }
    }
})

export const { register, login, logout } = authSlice.actions;
export default authSlice.reducer;
