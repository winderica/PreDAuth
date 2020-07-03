import { ErrorRequestHandler } from 'express';
import { logger } from '@utils/logger';

export const errorHandler: ErrorRequestHandler = ({ message }, _req, res, next) => {
    res.status(500).json({
        ok: false,
        payload: {
            message
        },
    });
    logger.error(message);
    next();
};
