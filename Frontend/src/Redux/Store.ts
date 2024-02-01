import { configureStore } from "@reduxjs/toolkit";
import vacationsReducer from './VacationsSlice';
import authReducer from './AuthSlice';
import settingsReducer from './SeettingsSlice';

export const store = configureStore({
    reducer: {
        vacations: vacationsReducer,
        auth: authReducer ,
        settings: settingsReducer
    }
});

export type RootState = ReturnType<typeof store.getState>

