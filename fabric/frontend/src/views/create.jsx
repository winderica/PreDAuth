import { PRE } from '../utils/pre';
import { Alice } from '../utils/alice';
import React, { useEffect, useState } from 'react';
import { Button, TextField } from '@material-ui/core';

export const App = () => {
    const [initialized, setInitialized] = useState(false);
    const [pre] = useState(new PRE());
    const [message, setMessage] = useState('');
    const [alice, setRoles] = useState(undefined);
    useEffect(() => {
        (async () => {
            await pre.init();
            setInitialized(true);
            const res = await fetch('http://127.0.0.1:3000/gh');
            const { g, h } = await res.json();
            setRoles(new Alice(pre, g, h));
        })();
    }, []);
    const handleEncrypt = async () => {
        await fetch('http://127.0.0.1:3000/create/12345', {
            method: 'POST',
            body: JSON.stringify(alice.encrypt(message)),
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
        </>
    );
};
