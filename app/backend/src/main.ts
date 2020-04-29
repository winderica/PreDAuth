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
const id = 'bob';

(async () => {
    try {
        await pre.init();
        await fetch('http://127.0.0.1:4000/user/register', {
            method: 'POST',
            body: JSON.stringify({ id }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const { payload: { g, h } } = await (await fetch(`http://127.0.0.1:4000/auth/generators/${id}`)).json();
        const bob = new Bob(pre, g, h);

        app.get('/pk', (_, res) => {
            res.json({ pk: bob.pk });
        });

        app.post('/decrypt', (req, res) => {
            const data = req.body as { data: string; key: { cb0: string; cb1: string }; iv: string }[];
            data.map(({ data, key, iv }) => console.log(bob.reDecrypt(data, key, iv)));
            res.sendStatus(200);
        });

        app.listen(4001, '0.0.0.0');

    } catch (e) {
        console.log(e);
    }
})();
