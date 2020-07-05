import React, { ChangeEvent, FC, useState } from 'react';
import { observer } from 'mobx-react';
import { Button, TextField, Typography } from '@material-ui/core';
import { Redirect, RouteComponentProps } from '@reach/router';

import { Dialog } from '../components/Dialog';
import { useStores } from '../hooks/useStores';
import { exportPublicKey, generateKey } from '../utils/ecdsa';
import { api } from '../api';

export const Register = observer<FC<RouteComponentProps>>(() => {
    const { identityStore, notificationStore } = useStores();
    const [id, setId] = useState('');
    const handleInput = ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
        setId(value);
    };
    const handleSubmit = async () => {
        try {
            const key = await generateKey();
            const publicKey = await exportPublicKey(key);
            await api.register(id, key, { publicKey });
            await identityStore.setId(id);
            await identityStore.setKey(key);
            notificationStore.enqueueSuccess('提交成功');
        } catch ({ message }) {
            notificationStore.enqueueError(message);
        }
    };
    return identityStore.id
        ? <Redirect to='/' noThrow />
        : <Dialog
            open={true}
            setOpen={() => undefined}
            title='初始化'
            content={
                <>
                    <Typography>请输入您的id（不可重复），我们将为您分配对应的公私钥</Typography>
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
            actions={<>
                <Button color='primary' onClick={handleSubmit}>提交</Button>
            </>}
        />;
});
