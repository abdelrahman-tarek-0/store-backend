import express from 'express';
import jwt from 'jsonwebtoken';
import config from '../config';

// middleware to check the validation of the token
const checkToken = (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
) => {
    try {
        const authHeader = req.get('Authorization');
        if (authHeader) {
            const bearer = authHeader.split(' ')[0].toLowerCase();
            const token = authHeader.split(' ')[1];
            if (token && bearer == 'bearer') {
                const isVerified = jwt.verify(
                    token,
                    config.TOKEN_PASS as string,
                );
                if (isVerified) {
                    next();
                } else {
                    throw new Error('token not valid');
                }
            } else {
                throw new Error('token not valid');
            }
        } else {
            throw new Error('token not valid');
        }
    } catch (error) {
        throw new Error('token not valid');
    }
};

export default checkToken;
