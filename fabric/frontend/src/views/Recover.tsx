import React, { ChangeEvent, FC, useState } from 'react';
import { observer } from 'mobx-react';
import { Redirect, RouteComponentProps } from '@reach/router';
import { Button, TextField } from '@material-ui/core';

import { api } from '../api';
import { useStores } from '../hooks/useStores';

export const Recover = observer<FC<RouteComponentProps>>(() => {
    const { identityStore, notificationStore, componentStateStore, userDataStore } = useStores();
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
        try {
            notificationStore.enqueueInfo('正在请求验证码');
            componentStateStore.setProgress(true);
            await api.sendCode(id, email);
            notificationStore.enqueueSuccess('成功发送验证码');
        } catch ({ message }) {
            notificationStore.enqueueError(message);
        } finally {
            componentStateStore.setProgress(false);
        }
    };
    const handleRecover = async () => {
        try {
            notificationStore.enqueueInfo('正在请求恢复数据');
            componentStateStore.setProgress(true);
            const { data } = await api.recoverByCode(id, { codes });
            data.forEach((obj) => {
                Object.entries(obj).forEach(([tag, kv]) => {
                    Object.entries<string>(JSON.parse(kv)).forEach(([key, value]) => {
                        userDataStore.set(key, value, tag);
                    });
                });
            });
            notificationStore.enqueueSuccess('成功获取恢复数据');
        } catch ({ message }) {
            notificationStore.enqueueError(message);
        } finally {
            componentStateStore.setProgress(false);
        }
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
            margin='dense'
            label='恢复手段'
            fullWidth
            value={email}
            onChange={handleInputEmail}
        />
        <Button variant='contained' color='primary' onClick={handleCodeRequest}>接收验证码</Button>
        {codes.map((i, j) => <TextField
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
