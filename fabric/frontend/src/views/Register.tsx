import { Button, TextField, Typography } from '@material-ui/core';
import { RouteComponentProps } from '@reach/router';
import { observer } from 'mobx-react';
import React, { ChangeEvent, FC, useState } from 'react';

import { api } from '../api';
import { Dialog } from '../components/Dialog';
import { useAlice } from '../hooks/useAlice';
import { useStores } from '../hooks/useStores';
import { encrypt } from '../utils/aliceBobWrapper';
import { apiWrapper } from '../utils/apiWrapper';
import { generateKey } from '../utils/ecdsa';

export const Register = observer<FC<RouteComponentProps>>(({ navigate }) => {
    const { identityStore, componentStateStore, userDataStore, keyStore } = useStores();
    const [id, setId] = useState('');
    const alice = useAlice();
    const handleInput = ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
        setId(value);
    };
    const handleSubmit = () => apiWrapper(async () => {
        const key = await generateKey();
        try {
            await identityStore.setKey(key);
        } catch {
            throw new Error('您的浏览器不支持Web Crypto密钥对象的序列化，推荐使用Chromium内核的浏览器访问本服务');
        }
        await api.register(id, key);
        await identityStore.setId(id);
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
