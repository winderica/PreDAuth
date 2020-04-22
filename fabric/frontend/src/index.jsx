import { PRE } from './utils/pre';
import { Alice } from './roles/alice';
import { Bob } from './roles/bob';
import { ProxyNode } from './roles/proxy';
import React, { useEffect, useState } from 'react';
import { render } from 'react-dom';
import { Button, TextField, FormControl } from '@material-ui/core';

const App = () => {
    const [decrypted, setDecrypted] = useState('');
    const [initialized, setInitialized] = useState(false);
    const [pre] = useState(new PRE());
    const [{ g, h }, setGH] = useState({ g: '', h: '' });
    const [{ cipher, key: { ca0, ca1 }, iv }, setEncrypted] = useState({ cipher: '', key: { ca0: '', ca1: '' }, iv: '' });
    const [rk, setRK] = useState('');
    const [{ cb0, cb1 }, setReEncrypted] = useState({ cb0: '', cb1: '' });
    const [message, setMessage] = useState('');
    const [{ alice, bob, proxy }, setRoles] = useState({ alice: undefined, bob: undefined, proxy: undefined });
    useEffect(() => {
        (async () => {
            await pre.init();
            setInitialized(true);
            const proxy = new ProxyNode(pre);
            const { g, h } = proxy.getGH();
            setGH({ g, h });
            setRoles({ alice: new Alice(pre, g, h), bob: new Bob(pre, g, h), proxy });
        })();
    }, []);
    const handleEncrypt = () => {
        setEncrypted(alice.encrypt(message));
    };
    const handleGetRK = () => {
        setRK(alice.reKey(bob.pk));
    };
    const handleReEncrypt = () => {
        setReEncrypted(proxy.reEncrypt({ ca0, ca1 }, rk));
    };
    const handleDecrypt = () => {
        setDecrypted(bob.reDecrypt(cipher, { cb0, cb1 }, iv));
    };
    const handleInput = (event) => {
        setMessage(event.target.value);
    };
    return initialized && (
        <>
            <TextField label='Message' onChange={handleInput} value={message} />
            <Button onClick={handleEncrypt}  variant="contained" color="primary" disabled={!message}>encrypt</Button>
            <Button onClick={handleGetRK}  variant="contained" color="primary" disabled={!cipher}>get RK</Button>
            <Button onClick={handleReEncrypt}  variant="contained" color="primary" disabled={!rk}>re-Encrypt</Button>
            <Button onClick={handleDecrypt}  variant="contained" color="primary" disabled={!cb0}>decrypt</Button>
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
            <FormControl fullWidth><TextField label="RK" multiline rowsMax={4} value={rk} /></FormControl>
            <FormControl fullWidth>
                <TextField label="Cb0" multiline rowsMax={4} value={cb0} />
                <TextField label="Cb1" multiline rowsMax={4} value={cb1} />
            </FormControl>
            <FormControl fullWidth><TextField label="Decrypted" multiline rowsMax={4} value={decrypted} /></FormControl>
        </>
    );
};


render(
    <App />,
    document.querySelector('#root')
);
