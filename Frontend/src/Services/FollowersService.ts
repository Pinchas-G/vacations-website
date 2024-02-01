import axios from "axios";
import appConfig from "../Utils/Config";
import { FollowerModel, FollowersPerDestination } from "../Models/FollowerModel";

class FollowersService {
    public async getFollowersPerDestination(): Promise<FollowersPerDestination[]> {
        const res = await axios.get(appConfig.followersUrl);
        return res.data;
    }
    
    public async addFollower(follower: FollowerModel): Promise<FollowerModel> {
        const res = await axios.post(appConfig.followersUrl, follower);
        return res.data;
    }

    public async deleteFollower(id: number): Promise<void> {
        await axios.delete(appConfig.followersUrl + id);
    }
}
const followersService = new FollowersService();
export default followersService;