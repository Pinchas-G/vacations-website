import axios from "axios";
import appConfig from "../Utils/Config";
import UserModel from "../Models/UserModel";
import { store } from "../Redux/Store";
import { login, logout, register } from "../Redux/AuthSlice";
import CredentialsModel from "../Models/CredentialsModel";

class AuthService {
    public async register(user: UserModel): Promise<void> {
        const response = await axios.post<string>(appConfig.registerUrl, user);
        const token = response.data;
        store.dispatch(register(token));
    }

    public async login(credentials: CredentialsModel): Promise<void> {
        const response = await axios.post<string>(appConfig.loginUrl, credentials);
        const token = response.data;
        store.dispatch(login(token));
    }

    public logout(): void {
        store.dispatch(logout());
    }
}

const authService = new AuthService();
export default authService;