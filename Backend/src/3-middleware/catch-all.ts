import { NextFunction, Request, Response } from "express";
import { errorsLogger } from "../4-utils/logger";
import appConfig from "../4-utils/app-config";

export default async function catchAll(err: any, req: Request, res: Response, next: NextFunction): Promise<void> {
    console.log(err);

    const status = err.status || 500;

    if (status >= 500) {
        await errorsLogger(err.message, err);
    }

    let msg = err.message;

    if (appConfig.isProduction && status >= 500) {
        msg = 'Something went wrong...';
    }
    res.status(status).send(msg);
}