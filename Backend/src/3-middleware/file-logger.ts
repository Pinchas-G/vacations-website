import { NextFunction, Request, Response } from "express";
import { activityLogger } from "../4-utils/logger";

export default async function fileLogger(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        await activityLogger(`Method: ${req.method}, Route: ${req.originalUrl}`);
        next();
    } catch (error: any) {
        next(error);
    }
}