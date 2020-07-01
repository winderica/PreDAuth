import React, { useState } from 'react';
import { observer, useLocalStore } from 'mobx-react';
import { Redirect } from '@reach/router';
import { Button, Card, CardActions, CardContent, CardHeader, Checkbox, FormControlLabel, Typography } from '@material-ui/core';

import { API } from '../constants';
import { Table } from '../components/Table';
import { useAlice } from '../hooks/useAlice';
import { useStores } from '../hooks/useStores';
import { useUserData } from '../hooks/useUserData';
import { useUrlParams } from '../hooks/useUrlParams';

const AuthGetting = observer(() => {
    const { identityStore, keyStore, userDataStore } = useStores();
    const request = useUrlParams('request');
    const alice = useAlice();
    const [checked, setChecked] = useState({});
    const handleAuth = async () => {
        const data = {};
        Object.entries(checked).filter(([, value]) => value).forEach(([tag]) => {
            data[tag] = alice.reKey(request.pk, keyStore.dataKey[tag].sk);
        });
        await fetch(API.reEncrypt(identityStore.id, request.callback), {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        });
    };

    const handleCheck = (event) => {
        const { name, checked } = event.target;
        setChecked((prevChecked) => ({ ...prevChecked, [name]: checked }));
    };
    return <>
        <CardContent>
            <Typography>为应用生成重加密密钥，将您保存在PreDAuth上的数据安全地发送给应用。</Typography>
            <Typography>应用{request.id}想要获取您的如下数据：</Typography>
            {request.data.map((key) => <FormControlLabel
                control={<Checkbox checked={!!checked[key]} disabled={!userDataStore.data[key]} onChange={handleCheck} name={key} />}
                label={key}
                key={key}
            />)}
            <Typography>数据对应的标签将自动勾选</Typography>
            {Object.entries(userDataStore.dataGroupedByTag).map(([tag, data]) => <FormControlLabel
                control={<Checkbox checked={!!Object.keys(data).filter((key) => checked[key]).length} name={tag} />}
                label={tag}
                key={tag}
            />)}
        </CardContent>
        <CardActions>
            <Button onClick={handleAuth} variant='contained' color='primary'>授权</Button>
        </CardActions>
    </>;
});

const AuthSetting = observer(() => {
    const { userDataStore, identityStore, notificationStore, keyStore } = useStores();
    const request = useUrlParams('request');
    const alice = useAlice();
    const deltaDataStore = useLocalStore(
        () => ({
            data: Object.fromEntries(Object.entries(request.data).map(([k, v]) => [k, { value: v, tag: '' }])),
            get dataArray() {
                return Object.entries(deltaDataStore.data).map(([key, { value, tag }]) => ({ key, value, tag }));
            },
            set(key, value, tag) {
                deltaDataStore.data[key] = { value, tag };
            },
            del(name) {
                delete deltaDataStore.data[name];
            }
        }),
    );
    const handleAuth = async () => {
        deltaDataStore.dataArray.map(({ key, value, tag }) => (userDataStore.set(key, value, tag)));
        const dataKey = await userDataStore.submit(identityStore.id, identityStore.key, alice);
        if (userDataStore.error) {
            notificationStore.enqueueError(userDataStore.message);
        } else {
            await keyStore.set(dataKey);
            notificationStore.enqueueSuccess('成功加密并提交');
        }
    };

    return <>
        <CardContent>
            <Typography>应用{request.id}想要更新您的以下数据：</Typography>
            <Table
                columns={[
                    { title: '键', field: 'key', grouping: false },
                    { title: '值', field: 'value', grouping: false },
                    { title: '标签', field: 'tag' },
                ]}
                title='个人信息'
                data={deltaDataStore.dataArray}
                editable={{
                    onRowDelete: async ({ key }) => deltaDataStore.del(key),
                    onRowAdd: async ({ key, value, tag }) => deltaDataStore.set(key, value, tag),
                    onRowUpdate: async ({ key, value, tag }, { key: oldKey }) => {
                        oldKey !== key && deltaDataStore.del(oldKey);
                        deltaDataStore.set(key, value, tag);
                    }
                }}
            />
        </CardContent>
        <CardActions>
            <Button onClick={handleAuth} variant='contained' color='primary'>授权</Button>
        </CardActions>
    </>;
});

export const Auth = observer(() => {
    const { identityStore } = useStores();
    const request = useUrlParams('request');
    useUserData();

    return (!identityStore.id || !request) ? <Redirect to='/' noThrow /> : (
        <Card>
            <CardHeader title='授权应用' />
            {request.type === 'get' ? <AuthGetting /> : <AuthSetting />}
        </Card>
    );
});
