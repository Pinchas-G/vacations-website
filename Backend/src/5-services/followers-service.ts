import { ResourceNotFound } from "../2-models/client-error";
import FollowerModel from "../2-models/follower-model";
import { executeSP } from "../4-utils/dal";

type FollowersPerDestination = {
    destination: string,
    followers: number
};

export async function getFollowersPerDestination(): Promise<FollowersPerDestination[]> {
    const followers = await executeSP<FollowersPerDestination[]>('spGetFollowersPerDestination');
    return followers.result;
}

export async function addFollower(follower: FollowerModel): Promise<FollowerModel> {
    const { userId, vacationId } = follower;
    const result = await executeSP<FollowerModel>('spAddFollower', userId, vacationId);
    return result.result[0];
}

export async function deleteFollower(id: number): Promise<void> {
    const result = await executeSP('spDeleteFollower', id);
    if (!result.affectedRows) throw new ResourceNotFound(id);
}