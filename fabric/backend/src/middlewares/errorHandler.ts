import { ErrorRequestHandler } from 'express';

export const errorHandler: ErrorRequestHandler = ({ message }: Error, _, res, next) => {
    res.json({
        ok: false,
        payload: message,
    });
    next();
};
