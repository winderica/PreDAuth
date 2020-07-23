import { Button, Card, IconButton, TextField } from '@material-ui/core';
import { AddCircleOutline, RemoveCircleOutline } from '@material-ui/icons';
import { Redirect, RouteComponentProps } from '@reach/router';
import { observer } from 'mobx-react';
import React, { ChangeEvent, FC, useState } from 'react';

import { api } from '../api';
import { useStores } from '../hooks/useStores';
import useStyles from '../styles/recover';
import { apiWrapper } from '../utils/apiWrapper';

export const Recover = observer<FC<RouteComponentProps>>(({ navigate }) => {
    const { identityStore, userDataStore, componentStateStore } = useStores();
    const classes = useStyles();
    const [email, setEmail] = useState('');
    const [id, setId] = useState('');
    const [codes, setCodes] = useState(['']);
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
    const handleCodeRequest = () => apiWrapper(() => api.sendCode(id, email), '正在请求验证码', '成功发送验证码');
    const handleRecover = () => apiWrapper(async () => {
        const { data } = await api.recoverByCode(id, { codes });
        data.forEach((obj) => {
            Object.entries(obj).forEach(([tag, kv]) => {
                Object.entries<string>(JSON.parse(kv)).forEach(([key, value]) => {
                    userDataStore.set(key, value, tag);
                });
            });
        });
        userDataStore.setInitialized();
        componentStateStore.setRecovered();
        if (!navigate) {
            throw new Error('How could this happen?');
        }
        await navigate('/register');
    }, '正在请求恢复数据', '成功获取恢复数据');
    const handleAddField = () => {
        setCodes((prevCodes) => [...prevCodes, '']);
    };
    const handleRemoveField = (index: number) => () => {
        setCodes((prevCodes) => prevCodes.filter((_, j) => j !== index));
    };
    return identityStore.id ? <Redirect to='/' noThrow /> : <>
        <Card className={classes.card}>
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
            <Button variant='contained' color='primary' onClick={handleCodeRequest} className={classes.button}>接收验证码</Button>
        </Card>
        <Card className={classes.card}>
            {codes.map((i, j) => <div key={j}>
                <TextField
                    margin='dense'
                    label='验证码'
                    value={i}
                    onChange={handleInputCode(j)}
                />
                <IconButton onClick={handleRemoveField(j)} disabled={codes.length <= 1}>
                    <RemoveCircleOutline />
                </IconButton>
                {j === codes.length - 1 && <IconButton onClick={handleAddField}>
                    <AddCircleOutline />
                </IconButton>}
            </div>)}
            <Button variant='contained' color='primary' onClick={handleRecover} className={classes.button}>恢复数据</Button>
        </Card>
    </>;
});
