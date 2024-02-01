import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../4-utils/cyber";
import RoleModel from "../2-models/role-model";
import { UnauthorizedError } from "../2-models/client-error";

export default async function verifyUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const user = await verifyToken(req);
        if (user.roleId !== RoleModel.User) throw new UnauthorizedError('You are not User');
        next();
    } catch (error) {
        next(error);
    }
}