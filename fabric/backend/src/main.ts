import { readFileSync } from 'fs';
import { createServer } from 'https';
import express, { json, urlencoded } from 'express';
import cors from 'cors';
import helmet from 'helmet';

import { routes } from './routes';
import { errorHandler } from '@middlewares/errorHandler';
import { errorLogger, infoLogger, warnLogger } from '@middlewares/accessLogger';
import { addAdmin } from '@utils/wallet';

(async (hostname, port) => {
    await Promise.all([1, 2].map(addAdmin));
    const app = express();
    app.use(helmet());
    app.use(urlencoded({ extended: true }));
    app.use(json());
    app.use(cors());
    app.use(infoLogger);
    app.use(warnLogger);
    app.use(errorLogger);
    app.use(routes);
    app.use(errorHandler);

    createServer({
        key: readFileSync('./assets/key.pem'),
        cert: readFileSync('./assets/cert.pem'),
    }, app).listen(port, hostname, () => {
        console.log(`Listening on ${hostname}:${port}`);
    });
})('0.0.0.0', 4000);
