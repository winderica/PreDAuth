import express, { json, urlencoded } from 'express';
import cors from 'cors';
import fs from 'fs';
import helmet from 'helmet';
import https from 'https';
import { routes } from './routes';
import { errorHandler } from '@middlewares/errorHandler';
import { errorLogger, infoLogger, warnLogger } from '@middlewares/accessLogger';
import { addAdmin } from '@utils/wallet';

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

    const httpsServer = https.createServer({
        key: fs.readFileSync('./assets/key.pem'),
        cert: fs.readFileSync('./assets/cert.pem'),
    }, app);
    httpsServer.listen(port, hostname, () => {
        console.log(`Listening on ${hostname}:${port}`);
    });
})('0.0.0.0', 4000);
