import express, { NextFunction, Request, Response } from "express";
import { addFollower, deleteFollower, getFollowersPerDestination } from "../5-services/followers-service";
import FollowerModel from "../2-models/follower-model";
import verifyAdmin from "../3-middleware/verify-admin";
import verifyUser from "../3-middleware/verify-user";

const router = express.Router();

// GET http://localhost:4000/api/followers/
router.get('/', verifyAdmin, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const followersPerDestination = await getFollowersPerDestination();
        res.json(followersPerDestination);
    } catch (error: any) {
        next(error);
    }
})

// POST http://localhost:4000/api/followers
router.post('/', verifyUser, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const follower = new FollowerModel(req.body);
        const savedFollower = await addFollower(follower);
        res.status(201).json(savedFollower);
    } catch (error: any) {
        next(error);
    }
})

// DELETE http://localhost:4000/api/followers/:id
router.delete('/:id([0-9]+)', verifyUser, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = +req.params.id;
        await deleteFollower(id);
        res.sendStatus(204);
    } catch (error: any) {
        next(error);
    }
})

export default router;
