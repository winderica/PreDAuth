import React, { useContext, useEffect } from 'react';
import { observer } from 'mobx-react';
import { Button } from '@material-ui/core';

import { useStyles } from '../styles/data';
import { useStores } from '../hooks/useStores';
import { AliceContext } from '../contexts';
import { Table } from '../components/Table';
import { API } from '../constants';
import { Notifier } from '../components/Notifier';
import { AlertDialog } from '../components/AlertDialog';

export const Data = observer(() => {
    const classes = useStyles();
    const { userDataStore, identityStore, keyStore, notificationStore } = useStores();
    const alice = useContext(AliceContext);
    useEffect(() => {
        (async () => {
            const { ok, payload } = await (await fetch(API.data(identityStore.id))).json();
            if (!ok) {
                notificationStore.enqueueSnackbar({
                    message: payload,
                    options: {
                        variant: 'info',
                    },
                });
                return;
            }
            Object.entries(payload).map(async ([tag, data]) => {
                Object.entries(JSON.parse(await alice.decrypt(data, keyStore.key[tag].sk))).map(([key, value]) => userDataStore.set(key, value, tag));
            });
            notificationStore.enqueueSnackbar({
                message: '已成功恢复数据',
                options: {
                    variant: 'success',
                },
            });
        })();
    }, []);
    const handleEncrypt = async () => {
        const data = userDataStore.dataGroupedByTag;
        const encrypted = {};
        Object.keys(data).map(async (tag) => {
            const { pk, sk } = alice.key();
            keyStore.set(tag, { pk, sk });
            encrypted[tag] = await alice.encrypt(JSON.stringify(data[tag]), pk);
        });
        const { ok, payload } = await (await fetch(API.data(identityStore.id), {
            method: 'POST',
            body: JSON.stringify(encrypted),
            headers: {
                'Content-Type': 'application/json'
            }
        })).json();
        notificationStore.enqueueSnackbar({
            message: ok ? '成功加密并提交' : payload,
            options: {
                variant: ok ? 'success' : 'error',
            },
        });
    };
    return (
        <div className={classes.container}>
            <Notifier />
            <Table
                columns={[
                    { title: '键', field: 'key', grouping: false },
                    { title: '值', field: 'value', grouping: false },
                    { title: '标签', field: 'tag' },
                ]}
                title='个人信息'
                data={userDataStore.dataArray.filter(i => i.tag !== '重要')}
                editable={{
                    onRowDelete: async ({ key }) => userDataStore.del(key),
                    onRowAdd: async ({ key, value, tag }) => userDataStore.set(key, value, tag),
                    onRowUpdate: async ({ key, value, tag }, { key: oldKey }) => {
                        oldKey !== key && userDataStore.del(oldKey);
                        userDataStore.set(key, value, tag);
                    }
                }}
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
