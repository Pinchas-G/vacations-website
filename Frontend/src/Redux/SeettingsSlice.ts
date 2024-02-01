import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface SettingsSlice {
    theme: string;
}

const initialState: SettingsSlice = {
    theme: localStorage.getItem('theme') ?? 'dark',
};

const settingsSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {
        setTheme: (state, action: PayloadAction<string>) => {
            state.theme = action.payload;
            localStorage.setItem('theme', action.payload);
        }
    },
});

export const { setTheme } = settingsSlice.actions;
export default settingsSlice.reducer;
