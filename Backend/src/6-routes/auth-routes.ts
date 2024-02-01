import express, { NextFunction, Request, Response } from "express";
import UserModel from "../2-models/user-model";
import { login, register } from "../5-services/auth-service";
import CredentialsModel from "../2-models/credentials-model";

const router = express.Router();

// POST http://localhost:4000/api/register
router.post('/register', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = new UserModel(req.body);
        const token = await register(user);
        res.status(201).json(token);
    } catch (error: any) {
        next(error);
    }
})

// POST http://localhost:4000/api/login
router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const credentials = new CredentialsModel(req.body);
        const token = await login(credentials);
        res.json(token);
    } catch (error: any) {
        next(error);
    }
})

export default router;