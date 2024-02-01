class FollowerModel {
    public id: number;
    public userId: number;
    public vacationId: number;
    
    public constructor(follower: FollowerModel) {
        this.id = follower.id;
        this.userId = follower.userId;
        this.vacationId = follower.vacationId;
    }
}
export default FollowerModel;