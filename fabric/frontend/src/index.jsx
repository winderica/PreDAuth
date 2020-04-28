import { PRE } from './utils/pre';
import { Alice } from './utils/alice';
import React, { useEffect, useState } from 'react';
import { render } from 'react-dom';
import { Button, FormControl, TextField } from '@material-ui/core';

const App = () => {
    const [initialized, setInitialized] = useState(false);
    const [pre] = useState(new PRE());
    const [{ g, h }, setGH] = useState({ g: '', h: '' });
    const [{ cipher, key: { ca0, ca1 }, iv }] = useState({ cipher: '', key: { ca0: '', ca1: '' }, iv: '' });
    const [message, setMessage] = useState('');
    const [alice, setRoles] = useState(undefined);
    useEffect(() => {
        (async () => {
            await pre.init();
            setInitialized(true);
            const res = await fetch('http://127.0.0.1:3000/gh');
            const { g, h } = await res.json();
            setGH({ g, h });
            setRoles(new Alice(pre, g, h));
        })();
    }, []);
    const handleEncrypt = async () => {
        const res = alice.encrypt(message);
        await fetch('http://127.0.0.1:3000/create/12345', {
            method: 'POST',
            body: JSON.stringify(res),
            headers: {
                'Content-Type': 'application/json'
            }
        });
    };
    const handleGetRK = async () => {
        const { pk } = await (await fetch('http://127.0.0.1:4000/pk')).json();
        const res = alice.reKey(pk);
        await fetch(`http://127.0.0.1:3000/rk/12345/${encodeURIComponent('http://127.0.0.1:4000/decrypt')}`, {
            method: 'POST',
            body: JSON.stringify({ rk: res }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
    };
    const handleInput = (event) => {
        setMessage(event.target.value);
    };
    return initialized && (
        <>
            <TextField label='Message' onChange={handleInput} value={message} />
            <Button onClick={handleEncrypt} variant="contained" color="primary" disabled={!message}>encrypt</Button>
            <Button onClick={handleGetRK} variant="contained" color="primary">RK</Button>
            <FormControl fullWidth>
                <TextField label="G" multiline rowsMax={4} value={g} />
                <TextField label="H" multiline rowsMax={4} value={h} />
            </FormControl>
            <FormControl fullWidth>
                <TextField label="Cipher" multiline rowsMax={4} value={cipher} />
                <TextField label="Ca0" multiline rowsMax={4} value={ca0} />
                <TextField label="Ca1" multiline rowsMax={4} value={ca1} />
                <TextField label="IV" multiline rowsMax={4} value={iv} />
            </FormControl>
        </>
    );
};


render(
    <App />,
    document.querySelector('#root')
);
