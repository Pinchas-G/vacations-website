import axios from "axios";
import appConfig from "../Utils/Config";
import UserModel from "../Models/UserModel";
import { store } from "../Redux/Store";
import { register } from "../Redux/AuthSlice";

class UsersService {
    public getUser(): UserModel {
        return store.getState().auth.user;
    }

    public async updateUser(user: UserModel): Promise<void> {
        const response = await axios.put<string>(appConfig.usersUrl + user.id, user);
        const token = response.data;
        store.dispatch(register(token));
    }
}

const usersService = new UsersService();
export default usersService;