import React, { ChangeEvent, FC, useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { Button, Card, CardActions, CardContent, CardHeader, Checkbox, FormControlLabel, TextField, Typography } from '@material-ui/core';
import { Redirect, RouteComponentProps } from '@reach/router';

import { useStores } from '../hooks/useStores';
import { useUserData } from '../hooks/useUserData';
import { useAlice } from '../hooks/useAlice';
import { api } from '../api';

export const Backup = observer<FC<RouteComponentProps>>(() => {
    const { identityStore, userDataStore, keyStore, notificationStore } = useStores();
    if (!identityStore.id) {
        return <Redirect to='/' noThrow />;
    }
    useUserData();
    const [checked, setChecked] = useState<Record<string, boolean>>({});
    const [pks, setPKs] = useState<string[]>([]);
    const [email, setEmail] = useState('');
    const alice = useAlice();
    useEffect(() => {
        void (async () => {
            try {
                const { pks } = await api.getPKs();
                setPKs(pks);
            } catch ({ message }) {
                notificationStore.enqueueError(message);
            }
        })();
    }, []);
    const handleCheck = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = event.target;
        setChecked((prevChecked) => ({ ...prevChecked, [name]: checked }));
    };
    const handleInput = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setEmail(value);
    };
    const handleBackup = async () => {
        const data: Record<string, { rk: Record<string, string>; email: string; }> = {};
        pks.map((pk) => {
            const rk: Record<string, string> = {};
            Object.entries(checked).filter(([, value]) => value).forEach(([tag]) => {
                rk[tag] = alice.reKey(pk, keyStore.dataKey[tag].sk);
            });
            data[pk] = {
                rk,
                email
            };
        });

        await api.backup(identityStore.id, identityStore.key, data);
    };
    return (
        <Card>
            <CardHeader title='备份数据' />
            <CardContent>
                <Typography>您可以输入恢复手段（邮箱或手机号），并指定允许PreDAuth获取的数据，为PreDAuth生成重加密密钥，以便于私钥丢失后仍能找回相应数据。</Typography>
                <Typography>对于敏感数据，您可以选择不信任PreDAuth，而是选择自己记忆，并承担私钥丢失的后果。</Typography>
                <TextField
                    autoFocus
                    margin='dense'
                    label='恢复手段'
                    fullWidth
                    value={email}
                    onChange={handleInput}
                />
                {Object.keys(userDataStore.dataGroupedByTag).map((tag) => <FormControlLabel
                    control={<Checkbox checked={!!checked[tag]} onChange={handleCheck} name={tag} />}
                    label={tag}
                    key={tag}
                />)}
            </CardContent>
            <CardActions>
                <Button variant='contained' color='primary' onClick={handleBackup}>备份</Button>
            </CardActions>
        </Card>
    );
});
