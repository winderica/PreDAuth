import React, { useContext, useEffect } from 'react';
import { observer } from 'mobx-react';
import { Button } from '@material-ui/core';
import { Redirect } from '@reach/router';

import { useStyles } from '../styles/data';
import { useStores } from '../hooks/useStores';
import { AliceContext } from '../contexts';
import { Table } from '../components/Table';
import { API } from '../constants';
import { random } from '../utils/random';
import { sign } from '../utils/ecdsa';

export const Data = observer(() => {
    const classes = useStyles();
    const { userDataStore, identityStore, keyStore, notificationStore } = useStores();
    if (!identityStore.id) {
        return <Redirect to='/' noThrow />;
    }
    const alice = useContext(AliceContext);
    useEffect(() => {
        (async () => {
            if (userDataStore.todo) {
                await userDataStore.fetch(identityStore.id, alice, keyStore.dataKey);
                userDataStore.error
                    ? notificationStore.enqueueError(userDataStore.message)
                    : notificationStore.enqueueSuccess('已成功恢复数据');
            }
        })();
    }, []);
    const handleEncrypt = async () => {
        const data = userDataStore.dataGroupedByTag;
        const encrypted = {};
        const dataKey = {};
        await Promise.all(Object.keys(data).map(async (tag) => {
            const { pk, sk } = alice.key();
            dataKey[tag] = { pk, sk };
            encrypted[tag] = await alice.encrypt(JSON.stringify(data[tag]), pk);
        }));
        await keyStore.set(dataKey);
        const nonce = random(32);
        const signature = await sign(nonce, identityStore.key);
        const { ok, payload } = await (await fetch(API.data(identityStore.id), {
            method: 'POST',
            body: JSON.stringify({
                nonce,
                signature,
                payload: encrypted
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })).json();
        notificationStore.enqueueSnackbar({
            message: ok ? '成功加密并提交' : payload.message,
            options: {
                variant: ok ? 'success' : 'error',
            },
        });
    };
    return (
        <div className={classes.container}>
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
