import express from 'express';
import Error from '../interface/error.interface';
const error_handler_middleware = (
    error: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
) => {
    const status = error.status || 500;
    const message = error.message || 'something went wrong';
    res.status(status).json({ status, message });
};
export default error_handler_middleware;
