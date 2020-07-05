import React, { ChangeEvent, FC, useState } from 'react';
import { observer } from 'mobx-react';
import { Redirect, RouteComponentProps } from '@reach/router';
import { Button, TextField } from '@material-ui/core';

import { useStores } from '../hooks/useStores';
import { api } from '../api';

export const Recover = observer<FC<RouteComponentProps>>(() => {
    const { identityStore } = useStores();
    const [email, setEmail] = useState('');
    const [id, setId] = useState('');
    const [codes, setCodes] = useState(['', '']);
    const handleInputEmail = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setEmail(value);
    };
    const handleInputId = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setId(value);
    };
    const handleInputCode = (index: number) => (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setCodes((prevCodes) => prevCodes.map((i, j) => j === index ? value : i));
    };
    const handleCodeRequest = async () => {
        await api.sendCode(id, email);
    };
    const handleRecover = async () => {
        const { data } = await api.recoverByCode(id, { codes });
        console.log(data);
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
