import express from 'express';
import { PRE } from './utils/pre';
import { Bob } from './utils/bob';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const pre = new PRE();

(async () => {
    try {
        await pre.init();
        const { payload: { g, h } } = await (await fetch('https://api.predauth.com/auth/generators')).json();
        const bob = new Bob(pre, g, h);

        app.get('/pk', (_, res) => {
            res.json({ pk: bob.pk });
        });

        app.post('/decrypt', (req, res) => {
            const data: Record<string, { data: string; key: { cb0: string; cb1: string }; iv: string }> = req.body;
            console.log(JSON.stringify({
                data: Object.fromEntries(Object.entries(data).map(([tag, { data, key, iv }]) =>
                    [tag, bob.reDecrypt(data, key, iv)]
                ))
            }));
            res.sendStatus(200);
        });

        app.listen(4001, '0.0.0.0');

    } catch (e) {
        console.log(e);
    }
})();
