import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import VacationModel from "../Models/VacationModel";
import { VacationsFilterModel } from "../Models/VacationsFilterModel";

interface VacationsSlice {
    vacationsList: VacationModel[];
    vacationsPages: Record<number, VacationModel[]>;
    followedVacationsPages: Record<number, VacationModel[]>;
    futureVacationsPages: Record<number, VacationModel[]>;
    activeVacationsPages: Record<number, VacationModel[]>;
    currentPage: number;
    filterBy: VacationsFilterModel;
    itemsPerPage: number;
    prevItemsPerPage: number;
}

const initialState: VacationsSlice = {
    vacationsList: [],
    vacationsPages: {},
    followedVacationsPages: {},
    futureVacationsPages: {},
    activeVacationsPages: {},
    currentPage: 1,
    filterBy: VacationsFilterModel.AllVacations,
    itemsPerPage: +localStorage.getItem('items-per-page') || 9,
    prevItemsPerPage: 0
}

export const vecaionsSlice = createSlice({
    name: 'vacations',
    initialState,
    reducers: {
        fetchVacations: (state, action: PayloadAction<{ page: number, vacationsByPage: VacationModel[], filterBy: number }>) => {
            const { page, vacationsByPage, filterBy } = action.payload;
            switch (filterBy) {
                case VacationsFilterModel.AllVacations:
                    state.vacationsPages[page] = vacationsByPage;
                    break;
                case VacationsFilterModel.FollowedVacations:
                    state.followedVacationsPages[page] = vacationsByPage;
                    break;
                case VacationsFilterModel.FutureVacations:
                    state.futureVacationsPages[page] = vacationsByPage;
                    break;
                case VacationsFilterModel.ActiveVacations:
                    state.activeVacationsPages[page] = vacationsByPage;
                    break;
            }
        },

        addVacation: (state, action: PayloadAction<{ addedVacation: VacationModel, page: number, filterBy: number }>) => {
            const { addedVacation, page, filterBy } = action.payload;
            switch (filterBy) {
                case VacationsFilterModel.AllVacations:
                    state.vacationsPages[page]?.push(addedVacation);
                    break;
                case VacationsFilterModel.FollowedVacations:
                    state.followedVacationsPages[page]?.push(addedVacation);
                    break;
                case VacationsFilterModel.FutureVacations:
                    state.futureVacationsPages[page]?.push(addedVacation);
                    break;
                case VacationsFilterModel.ActiveVacations:
                    state.activeVacationsPages[page]?.push(addedVacation);
                    break;
            }
        },

        updateVacation: (state, action: PayloadAction<{ updatedVacation: VacationModel, page: number, filterBy: number }>) => {
            const { updatedVacation, page, filterBy } = action.payload;
            let index: number;
            switch (filterBy) {
                case VacationsFilterModel.AllVacations:
                    index = state.vacationsPages[page]?.findIndex(v => v.id === updatedVacation.id);
                    index && (state.vacationsPages[page][index] = updatedVacation);
                    break;
                case VacationsFilterModel.FollowedVacations:
                    index = state.followedVacationsPages[page]?.findIndex(v => v.id === updatedVacation.id);
                    index && (state.followedVacationsPages[page][index] = updatedVacation);
                    break;
                case VacationsFilterModel.FutureVacations:
                    index = state.futureVacationsPages[page]?.findIndex(v => v.id === updatedVacation.id);
                    index && (state.futureVacationsPages[page][index] = updatedVacation);
                    break;
                case VacationsFilterModel.ActiveVacations:
                    index = state.activeVacationsPages[page]?.findIndex(v => v.id === updatedVacation.id);
                    index && (state.activeVacationsPages[page][index] = updatedVacation);
                    break;
            }
        },

        updateFollower: (state, action: PayloadAction<{ vacationId: number, isFollower: number, page: number, filterBy: number }>) => {
            const { vacationId, isFollower, page, filterBy } = action.payload;
            switch (filterBy) {
                case VacationsFilterModel.AllVacations:
                    state.vacationsPages[page].map(v => v.id === vacationId && (v.isFollower = isFollower));
                    break;
                case VacationsFilterModel.FollowedVacations:
                    state.followedVacationsPages[page].map(v => v.id === vacationId && (v.isFollower = isFollower));
                    break;
                case VacationsFilterModel.FutureVacations:
                    state.futureVacationsPages[page].map(v => v.id === vacationId && (v.isFollower = isFollower));
                    break;
                case VacationsFilterModel.ActiveVacations:
                    state.activeVacationsPages[page].map(v => v.id === vacationId && (v.isFollower = isFollower));
                    break;
            }
        },

        deleteVacation: (state, action: PayloadAction<{ vacationId: number, page: number, filterBy: number }>) => {
            const { vacationId, page, filterBy } = action.payload;
            let index: number;
            switch (filterBy) {
                case VacationsFilterModel.AllVacations:
                    index = state.vacationsPages[page].findIndex(v => v.id === vacationId);
                    if (index >= 0) state.vacationsPages[page].splice(index, 1);
                    break;
                case VacationsFilterModel.FollowedVacations:
                    index = state.followedVacationsPages[page].findIndex(v => v.id === vacationId);
                    if (index >= 0) state.followedVacationsPages[page].splice(index, 1);
                    break;
                case VacationsFilterModel.FutureVacations:
                    index = state.futureVacationsPages[page].findIndex(v => v.id === vacationId);
                    if (index >= 0) state.futureVacationsPages[page].splice(index, 1);
                    break;
                case VacationsFilterModel.ActiveVacations:
                    index = state.activeVacationsPages[page].findIndex(v => v.id === vacationId);
                    if (index >= 0) state.activeVacationsPages[page].splice(index, 1);
                    break;
            }
        },

        saveCurrentPage: (state, action: PayloadAction<number>) => {
            state.currentPage = action.payload;
        },

        savefilterBy: (state, action: PayloadAction<VacationsFilterModel>) => {
            state.filterBy = action.payload;
        },

        setItemsPerPage: (state, action: PayloadAction<number>) => {
            state.itemsPerPage = action.payload;
            localStorage.setItem('items-per-page', JSON.stringify(action.payload));
        },

        setPrevItemsPerPage: (state, action: PayloadAction<number>) => {
            state.prevItemsPerPage = action.payload;
        }
    }
})
export const {
    fetchVacations,
    addVacation,
    updateVacation,
    updateFollower,
    deleteVacation,
    saveCurrentPage,
    savefilterBy,
    setItemsPerPage,
    setPrevItemsPerPage
} = vecaionsSlice.actions;
export default vecaionsSlice.reducer;