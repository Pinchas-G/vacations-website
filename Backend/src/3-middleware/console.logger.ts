import { NextFunction, Request, Response } from "express";

export default function consoleLogger(req: Request, res: Response, next: NextFunction) {
    console.log(`Method: ${req.method}, Route: ${req.originalUrl}`);
    next();
}