import express, { json, urlencoded } from 'express';
import cors from 'cors';
import { routes } from './routes';
import { errorHandler } from './middlewares/errorHandler';
import { addAdmin } from './utils/wallet';

(async (hostname = '0.0.0.0', port = 4000) => {
    try {
        await addAdmin();
        const app = express();
        app.use(urlencoded({ extended: true }));
        app.use(json());
        app.use(cors());
        app.use(routes);
        app.use(errorHandler);

        app.listen(port, hostname, () => {
            console.log(`Listening on ${hostname}:${port}`);
        });
    } catch (e) {
        console.log(e);
    }
})();
