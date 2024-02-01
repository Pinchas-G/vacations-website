import { Request } from "express";
import UserModel from "../2-models/user-model";
import jwt from "jsonwebtoken";
import { UnauthorizedError } from "../2-models/client-error";
import crypto from 'crypto';

const secretKey = 'd7%#J^h8@***_WTF!!!';

export function createToken(user: UserModel): string {
    delete user.password;
    const container = { user };
    const options = { expiresIn: '3h' };
    const token = jwt.sign(container, secretKey, options);
    return token;
}

export function verifyToken(req: Request): Promise<UserModel> {
    return new Promise((res, rej) => {
        const header = req.header('authorization');
        if (!header) rej(new UnauthorizedError('Unauthorized'));

        const token = header.replace('Bearer ', '');
        if (!token) rej(new UnauthorizedError('Missing Token'));

        jwt.verify(token, secretKey, (err, container: { user: UserModel }) => {
            if (err) rej(new UnauthorizedError('Invalid token'));
            res(container.user);
        })
    })
}

export function hashPassword(password: string): string {
    const salt = 'BRING THEM HOME NOW';
    return crypto.createHmac('sha512', salt).update(password).digest('hex');
}