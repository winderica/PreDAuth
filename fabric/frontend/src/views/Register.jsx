import React, { useState } from 'react';
import { Button, TextField, Typography } from '@material-ui/core';

import { Dialog } from '../components/Dialog';
import { useStores } from '../hooks/useStores';
import { exportPublicKey, generateKey, sign } from '../utils/ecdsa';
import { random } from '../utils/random';
import { API } from '../constants';
import { observer } from 'mobx-react';
import { Redirect } from '@reach/router';

export const Register = observer(() => {
    const { identityStore, notificationStore } = useStores();
    const [id, setId] = useState('');
    const handleInput = (event) => {
        setId(event.target.value);
    };
    const handleSubmit = async () => {
        const key = await generateKey();
        const publicKey = await exportPublicKey(key);
        const nonce = random(32);
        const signature = await sign(nonce, key);
        const { ok, payload } = await (await fetch(API.register, {
            method: 'POST',
            body: JSON.stringify({ id, nonce, signature, payload: { publicKey } }),
            headers: {
                'Content-Type': 'application/json'
            }
        })).json();
        if (ok) {
            await identityStore.setId(id);
            await identityStore.setKey(key);
        }
        notificationStore.enqueueSnackbar({
            message: ok ? '提交成功' : payload.message,
            options: {
                variant: ok ? 'success' : 'warning',
            },
        });
    };
    return identityStore.id ? <Redirect to='/' noThrow /> : (
        <Dialog
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
        />
    );
});
