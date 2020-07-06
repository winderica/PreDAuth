import React, { FC } from 'react';
import { observer } from 'mobx-react';
import { Button } from '@material-ui/core';
import { Redirect, RouteComponentProps } from '@reach/router';

import { useStyles } from '../styles/data';
import { Table } from '../components/Table';
import { useAlice } from '../hooks/useAlice';
import { useStores } from '../hooks/useStores';
import { useUserData } from '../hooks/useUserData';
import { Encrypted, PreKeyPair } from '../utils/alice';
import { api } from '../api';

export const Data = observer<FC<RouteComponentProps>>(() => {
    const classes = useStyles();
    const stores = useStores();
    const { userDataStore, identityStore, keyStore, notificationStore, componentStateStore } = stores;
    if (!identityStore.id) {
        return <Redirect to='/' noThrow />;
    }
    const alice = useAlice();
    useUserData();
    const handleEncrypt = async () => {
        const encrypted: Record<string, Encrypted> = {};
        const dataKey: Record<string, PreKeyPair> = {};
        await Promise.all(userDataStore.dataArrayGroupedByTag.map(async ([tag, kv]) => {
            const { pk, sk } = alice.key();
            dataKey[tag] = { pk, sk };
            encrypted[tag] = await alice.encrypt(JSON.stringify(kv), pk);
        }));
        try {
            notificationStore.enqueueInfo('正在提交加密数据');
            componentStateStore.setProgress(true);
            await api.setData(identityStore.id, identityStore.key, encrypted);
            await keyStore.set(dataKey);
            notificationStore.enqueueSuccess('成功加密并提交');
        } catch ({ message }) {
            notificationStore.enqueueError(message);
        } finally {
            componentStateStore.setProgress(false);
        }
    };
    return (
        <div className={classes.container}>
            <Table
                title='个人信息'
                dataStore={userDataStore}
            />
            <Button
                onClick={handleEncrypt}
                variant='contained'
                color='primary'
                className={classes.button}
            >
                加密并提交
            </Button>
        </div>
    );
});
