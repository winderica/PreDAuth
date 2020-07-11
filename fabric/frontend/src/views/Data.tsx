import { Button } from '@material-ui/core';
import { Redirect, RouteComponentProps } from '@reach/router';
import { toJS } from 'mobx';
import { observer } from 'mobx-react';
import React, { FC } from 'react';

import { api } from '../api';
import { Table } from '../components/Table';
import { useAlice } from '../hooks/useAlice';
import { useStores } from '../hooks/useStores';
import { useUserData } from '../hooks/useUserData';
import { UserDataStore } from '../stores';
import { useStyles } from '../styles/data';
import { encrypt } from '../utils/aliceWrapper';
import { apiWrapper } from '../utils/apiWrapper';

export const Data = observer<FC<RouteComponentProps>>(() => {
    const classes = useStyles();
    const stores = useStores();
    const { userDataStore, identityStore, keyStore } = stores;
    if (!identityStore.id) {
        return <Redirect to='/' noThrow />;
    }
    const alice = useAlice();
    useUserData();
    const tempDataStore = new UserDataStore(toJS(userDataStore.data));
    const handleEncrypt = async () => {
        userDataStore.setAll(toJS(tempDataStore.data));
        const { dataKey, encrypted } = await encrypt(alice, userDataStore.dataArrayGroupedByTag);
        await apiWrapper(async () => {
            await api.setData(identityStore.id, identityStore.key, encrypted);
            await keyStore.set(dataKey);
        }, '正在提交加密数据', '成功加密并提交');
    };
    return (
        <div className={classes.container}>
            <Table title='个人信息' dataStore={tempDataStore} />
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
