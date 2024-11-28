import jwt from 'jsonwebtoken';
import { NextFunction } from 'express';
import { Local } from '../environment/env';

const Secret: any = Local.SECRET_KEY;

const userAuthMiddleware = async (req: any, res: any, next: NextFunction) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) {
        return res.status(403);
    }

    jwt.verify(token, Secret, (err: any, uuid: any) => {
        if (err) {
            return res.status(401).json({ "message": err });
        }

        req.user = uuid;
        next();
    });
};

export default userAuthMiddleware;
