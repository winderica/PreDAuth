import React, { useState } from 'react';
import { observer } from 'mobx-react';
import { Redirect } from '@reach/router';
import { Button, TextField } from '@material-ui/core';

import { useStores } from '../hooks/useStores';
import { API } from '../constants';

export const Recover = observer(() => {
    const { identityStore } = useStores();
    const [email, setEmail] = useState('');
    const [id, setId] = useState('');
    const [codes, setCodes] = useState(['', '']);
    const handleInputEmail = (event) => {
        const { value } = event.target;
        setEmail(value);
    };
    const handleInputId = (event) => {
        const { value } = event.target;
        setId(value);
    };
    const handleInputCode = (index) => (event) => {
        const { value } = event.target;
        setCodes((prevCodes) => prevCodes.map((i, j) => j === index ? value : i));
    };
    const handleCodeRequest = async () => {
        await fetch(API.sendCode(id, email));
    };
    const handleRecover = async () => {
        const { payload } = await (await fetch(API.recoverByCode(id), {
            method: 'POST',
            body: JSON.stringify({
                payload: { codes }
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })).json();
        console.log(payload);
    };
    return identityStore.id ? <Redirect to='/' noThrow /> : <>
        <TextField
            autoFocus
            margin='dense'
            label='id'
            fullWidth
            value={id}
            onChange={handleInputId}
        />
        <TextField
            autoFocus
            margin='dense'
            label='恢复手段'
            fullWidth
            value={email}
            onChange={handleInputEmail}
        />
        <Button variant='contained' color='primary' onClick={handleCodeRequest}>接收验证码</Button>
        {codes.map((i, j) => <TextField
            autoFocus
            margin='dense'
            label='验证码'
            fullWidth
            key={j}
            value={i}
            onChange={handleInputCode(j)}
        />)}
        <Button variant='contained' color='primary' onClick={handleRecover}>恢复数据</Button>
    </>;
});
