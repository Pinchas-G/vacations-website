import axios from "axios";
import VacationModel from "../Models/VacationModel";
import appConfig from "../Utils/Config";
import { store } from "../Redux/Store";
import { addVacation, deleteVacation, fetchVacations, setPrevItemsPerPage, updateVacation } from "../Redux/VacationsSlice";
import { VacationsFilterModel } from "../Models/VacationsFilterModel";

type VacationLocate = {
    vacationId: number,
    page: number,
    filterBy: number,
    userId?: number
}

class VacationsService {
    public async getVacations(page: number, itemsPerPage: number, prevItemsPerPage: number, userId: number, filterBy: number): Promise<VacationModel[]> {
        let vacationsByPage: VacationModel[] = [];

        switch (filterBy) {
            case VacationsFilterModel.AllVacations:
                vacationsByPage = store.getState().vacations.vacationsPages[page];
                break;
            case VacationsFilterModel.FollowedVacations:
                vacationsByPage = store.getState().vacations.followedVacationsPages[page];
                break;
            case VacationsFilterModel.FutureVacations:
                vacationsByPage = store.getState().vacations.futureVacationsPages[page];
                break;
            case VacationsFilterModel.ActiveVacations:
                vacationsByPage = store.getState().vacations.activeVacationsPages[page];
                break;
        }

        if (!vacationsByPage || itemsPerPage !== prevItemsPerPage) {
            console.log('service');
            const limit = itemsPerPage;
            const res = await axios.get<VacationModel[]>(appConfig.vacationsUrl, { params: { page, limit, userId, filterBy } });
            vacationsByPage = res.data;
            store.dispatch(fetchVacations({ page, vacationsByPage, filterBy }));
            store.dispatch(setPrevItemsPerPage(itemsPerPage));
        }
        return vacationsByPage;
    }

    public async getVacation({ vacationId, page, filterBy, userId }: VacationLocate): Promise<VacationModel> {
        let vacationsByPage: VacationModel[] = [];
        let vacation: VacationModel;

        switch (filterBy) {
            case VacationsFilterModel.AllVacations:
                vacationsByPage = store.getState().vacations.vacationsPages[page];
                break;
            case VacationsFilterModel.FollowedVacations:
                vacationsByPage = store.getState().vacations.followedVacationsPages[page];
                break;
            case VacationsFilterModel.FutureVacations:
                vacationsByPage = store.getState().vacations.futureVacationsPages[page];
                break;
            case VacationsFilterModel.ActiveVacations:
                vacationsByPage = store.getState().vacations.activeVacationsPages[page];
                break;
        }
        vacation = vacationsByPage && vacationsByPage.find(v => v.id === vacationId);

        if (!vacation) {
            const response = await axios.get<VacationModel>(appConfig.vacationsUrl + vacationId, { params: { userId } });
            vacation = response.data;
        }
        return vacation;
    }

    public async addVacation(vacation: VacationModel, page: number, filterBy: number): Promise<void> {
        const myData = new FormData();
        myData.append('destination', vacation.destination);
        myData.append('description', vacation.description);
        myData.append('startDate', vacation.startDate);
        myData.append('endDate', vacation.endDate);
        myData.append('price', vacation.price.toString());
        myData.append('image', vacation.image[0]);        

        const response = await axios.post<VacationModel>(appConfig.vacationsUrl, myData);
        const addedVacation = response.data;

        store.dispatch(addVacation({ addedVacation, page, filterBy }));
    }

    public async updateVacation(vacation: VacationModel, page: number, filterBy: number): Promise<void> {
        const myData = new FormData();
        myData.append('destination', vacation.destination);
        myData.append('description', vacation.description);
        myData.append('startDate', vacation.startDate);
        myData.append('endDate', vacation.endDate);
        myData.append('price', vacation.price.toString());
        myData.append('image', vacation.image[0]);

        console.log(vacation.image[0]);
        

        const response = await axios.put<VacationModel>(appConfig.vacationsUrl + vacation.id, myData);
        const updatedVacation = response.data;

        store.dispatch(updateVacation({ updatedVacation, page, filterBy }));
    }


    public async deleteVacation({ vacationId, page, filterBy }: VacationLocate): Promise<void> {
        await axios.delete<void>(appConfig.vacationsUrl + vacationId);
        store.dispatch(deleteVacation({ vacationId, page, filterBy }));
    }
}
const vacationsService = new VacationsService();
export default vacationsService;