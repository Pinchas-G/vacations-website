import { Request, Response, NextFunction } from "express";
import { RouteNotFound } from "../2-models/client-error";

export default function routeNotFound(req: Request, res: Response, next: NextFunction): void {
    const err = new RouteNotFound(req.originalUrl);
    next(err);
}