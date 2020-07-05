import React, { FC } from 'react';
import { observer } from 'mobx-react';
import { Button } from '@material-ui/core';
import { Redirect, RouteComponentProps } from '@reach/router';

import { useStyles } from '../styles/data';
import { Table } from '../components/Table';
import { useAlice } from '../hooks/useAlice';
import { useStores } from '../hooks/useStores';
import { useUserData } from '../hooks/useUserData';

export const Data = observer<FC<RouteComponentProps>>(() => {
    const classes = useStyles();
    const stores = useStores();
    const { userDataStore, identityStore, keyStore, notificationStore } = stores;
    if (!identityStore.id) {
        return <Redirect to='/' noThrow />;
    }
    const alice = useAlice();
    useUserData();
    const handleEncrypt = async () => {
        const dataKey = await userDataStore.submit(identityStore.id, identityStore.key, alice);
        if (userDataStore.error) {
            notificationStore.enqueueError(userDataStore.message);
        } else {
            await keyStore.set(dataKey);
            notificationStore.enqueueSuccess('成功加密并提交');
        }
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
                    // eslint-disable-next-line @typescript-eslint/require-await
                    onRowDelete: async ({ key }) => userDataStore.del(key),
                    // eslint-disable-next-line @typescript-eslint/require-await
                    onRowAdd: async ({ key, value, tag }) => userDataStore.set(key, value, tag),
                    // eslint-disable-next-line @typescript-eslint/require-await
                    onRowUpdate: async ({ key, value, tag }, oldData) => {
                        oldData && oldData.key !== key && userDataStore.del(oldData.key);
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
