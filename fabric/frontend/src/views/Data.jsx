import React, { useContext, useEffect } from 'react';
import { observer } from 'mobx-react';
import { Button } from '@material-ui/core';

import { useStyles } from '../styles/data';
import { useStores } from '../hooks/useStores';
import { AliceContext } from '../contexts';
import { Table } from '../components/Table';
import { API } from '../constants';

export const Data = observer(() => {
    const classes = useStyles();
    const { userDataStore, identityStore, keyStore } = useStores();
    const alice = useContext(AliceContext);
    useEffect(() => {
        (async () => {
            const { payload } = await (await fetch(API.data(identityStore.id))).json();
            Object.entries(payload).forEach(([tag, data]) => {
               Object.entries(JSON.parse(alice.decrypt(data, keyStore.key[tag].sk))).map(([key, value]) => userDataStore.set(key, value, tag));
            });
        })();
    }, []);
    const handleEncrypt = async () => {
        const data = userDataStore.dataGroupedByTag;
        const encrypted = {};
        Object.keys(data).forEach((tag) => {
            const { pk, sk } = alice.key();
            keyStore.set(tag, { pk, sk });
            encrypted[tag] = alice.encrypt(JSON.stringify(data[tag]), pk);
        });
        await fetch(API.data(identityStore.id), {
            method: 'POST',
            body: JSON.stringify(encrypted),
            headers: {
                'Content-Type': 'application/json'
            }
        });
    };
    return (
        <div className={classes.container}>
            <Table
                columns={[
                    { title: 'key', field: 'key', grouping: false },
                    { title: 'value', field: 'value', grouping: false },
                    { title: 'tag', field: 'tag' },
                ]}
                title='Personal information'
                data={userDataStore.dataArray}
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
                encrypt
            </Button>
        </div>
    );
});
