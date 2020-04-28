import { PRE } from '../utils/pre';
import { Alice } from '../utils/alice';
import React, { useEffect, useState } from 'react';
import { Button, FormControl, TextField } from '@material-ui/core';

const id = 'alice';

export const Index = () => {
    const [initialized, setInitialized] = useState(false);
    const [pre] = useState(new PRE());
    const [{ g, h }, setGH] = useState({ g: '', h: '' });
    const [message, setMessage] = useState('');
    const [alice, setRoles] = useState(undefined);
    useEffect(() => {
        (async () => {
            await pre.init();
            setInitialized(true);
            await fetch('http://127.0.0.1:4000/user/register', {
                method: 'POST',
                body: JSON.stringify({ id }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const res = await fetch(`http://127.0.0.1:4000/auth/generators/${id}`);
            const { payload: { g, h } } = await res.json();
            setGH({ g, h });
            setRoles(new Alice(pre, g, h));
        })();
    }, []);
    const handleEncrypt = async () => {
        await fetch(`http://127.0.0.1:4000/user/${id}/data`, {
            method: 'POST',
            body: JSON.stringify(alice.encrypt(message)),
            headers: {
                'Content-Type': 'application/json'
            }
        });
    };
    const handleGetRK = async () => {
        const { pk } = await (await fetch('http://127.0.0.1:4001/pk')).json();
        const res = alice.reKey(pk);
        await fetch(`http://127.0.0.1:4000/auth/reEncrypt/${id}/${encodeURIComponent('http://127.0.0.1:4001/decrypt')}`, {
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
        </>
    );
};
