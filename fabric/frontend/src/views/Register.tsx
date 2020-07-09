import React, { ChangeEvent, FC, useState } from 'react';
import { observer } from 'mobx-react';
import { Button, TextField, Typography } from '@material-ui/core';
import { RouteComponentProps } from '@reach/router';

import { api } from '../api';
import { Dialog } from '../components/Dialog';
import { useStores } from '../hooks/useStores';
import { generateKey } from '../utils/ecdsa';
import { apiWrapper } from '../utils/apiWrapper';
import { encrypt } from '../utils/aliceWrapper';
import { useAlice } from '../hooks/useAlice';

export const Register = observer<FC<RouteComponentProps>>(({ navigate }) => {
    const { identityStore, componentStateStore, userDataStore, keyStore } = useStores();
    const [id, setId] = useState('');
    const alice = useAlice();
    const handleInput = ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
        setId(value);
    };
    const handleSubmit = () => apiWrapper(async () => {
        const key = await generateKey();
        await api.register(id, key);
        await identityStore.setId(id);
        await identityStore.setKey(key);
        if (componentStateStore.recovered) {
            const { dataKey, encrypted } = await encrypt(alice, userDataStore.dataArrayGroupedByTag);
            await api.setData(id, key, encrypted);
            await keyStore.set(dataKey);
            componentStateStore.setRecovered(false);
        }
        if (!navigate) {
            throw new Error('How could this happen?');
        }
        await navigate('/');
    }, '正在提交', '提交成功');
    return (
        <Dialog
            open={true}
            setOpen={() => undefined}
            title={componentStateStore.recovered ? '恢复即将完成' : '初始化'}
            content={
                <>
                    <Typography>{
                        componentStateStore.recovered
                            ? '出于安全因素，请输入一个新的id（不可重复），我们将为您重新分配公私钥'
                            : '请输入您的id（不可重复），我们将为您分配对应的公私钥'
                    }</Typography>
                    <TextField
                        autoFocus
                        margin='dense'
                        label='id'
                        value={id}
                        fullWidth
                        onChange={handleInput}
                    />
                </>
            }
            actions={
                <Button color='primary' onClick={handleSubmit}>提交</Button>
            }
        />
    );
});
