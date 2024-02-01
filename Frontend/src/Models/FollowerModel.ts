export interface FollowerModel {
    id?: number;
    userId: number;
    vacationId: number;
}

export type FollowersPerDestination = {
    destination: string;
    followers: number;
}