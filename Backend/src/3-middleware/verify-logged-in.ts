import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../4-utils/cyber";

export default async function verifyLoggedIn(req: Request, res: Response, next: NextFunction) :Promise<void>{
    try {
        await verifyToken(req);
        next();
    } catch (error) {
        next(error);
    }
}