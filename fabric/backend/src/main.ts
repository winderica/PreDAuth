import express, { json, urlencoded } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { routes } from './routes';
import { errorHandler } from '@middlewares/errorHandler';
import { errorLogger, infoLogger, warnLogger } from '@middlewares/accessLogger';
import { addAdmin, addUser } from '@utils/wallet';

(async (hostname, port) => {
    await addAdmin();
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
    app.listen(port, hostname, () => {
        console.log(`Listening on ${hostname}:${port}`);
    });
})('0.0.0.0', 4000);
