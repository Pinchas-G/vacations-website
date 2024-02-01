import express, { NextFunction, Request, Response } from "express";
import UserModel from "../2-models/user-model";
import { updateUser } from "../5-services/users-service";
import verifyLoggedIn from "../3-middleware/verify-logged-in";

const router = express.Router();

// PUT http://localhost:4000/api/users/:id
router.put('/:id([0-9]+)', verifyLoggedIn, async (req: Request, res: Response, next: NextFunction) => {
    try {
        req.body.id = +req.params.id;
        const user = new UserModel(req.body);
        const token = await updateUser(user);
        res.json(token);
    } catch (error: any) {
        next(error);
    }
})

export default router;