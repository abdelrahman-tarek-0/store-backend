import express from 'express';
import UserModel from '../models/user.model';
import jwt from 'jsonwebtoken';
import config from '../config';
const userModel = new UserModel();
import User from '../types/user.type';

//create
export const create = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
) => {
    try {
        const user = await userModel.create({
            user_name: req.body.user_name,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            password: req.body.password,
        } as User);
        res.json({
            status: 'create user is done',
            data: { ...user },
        });
    } catch (error) {
        res.status(500);
        next(error);
    }
};
//get all
export const index = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
) => {
    try {
        const users = await userModel.index();
        res.json({
            status: 'get all is done',
            data: users,
        });
    } catch (error) {
        next(error);
    }
};
//get one
export const show = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
) => {
    try {
        const user = await userModel.show(parseInt(req.params.id));
        res.json({
            status: 'get the one is done',
            data: user,
        });
    } catch (error) {
        next(error);
    }
};
//update
export const update = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
) => {
    try {
        const user = await userModel.update(
            {
                user_name: req.body.user_name,
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                password: req.body.password,
            },
            parseInt(req.params.id),
        );
        res.json({
            status: 'the user is updated',
            data: user,
        });
    } catch (error) {
        next(error);
    }
};
//delete
export const deleteOne = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
) => {
    try {
        const user = await userModel.delete(parseInt(req.params.id));
        res.json({
            status: 'the user is deleted',
            data: user,
        });
    } catch (error) {
        next(error);
    }
};

//sign in + create the token using user_name
export const auth = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
) => {
    try {
        const user_name = req.body.user_name;
        const password = req.body.password;
        const user = await userModel.auth(user_name, password);
        if (user) {
            const token = jwt.sign(
                { user_name },
                config.TOKEN_PASS as string,
            );
            res.set('Authorization', token);
            return res.json({
                status: 'logged in',
                data: { ...user, token },
            });
        } else {
            return res
                .status(401)
                .send('username or password are wrong');
        }
    } catch (error) {
        next(error);
    }
};
