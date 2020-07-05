import React, { ChangeEvent, FC, useState } from 'react';
import { observer, useLocalStore } from 'mobx-react';
import { Redirect, RouteComponentProps } from '@reach/router';
import { Button, Card, CardActions, CardContent, CardHeader, Checkbox, FormControlLabel, Typography } from '@material-ui/core';

import { Table } from '../components/Table';
import { useAlice } from '../hooks/useAlice';
import { useStores } from '../hooks/useStores';
import { useUserData } from '../hooks/useUserData';
import { useUrlParams } from '../hooks/useUrlParams';
import { api } from '../api';

interface AuthGettingRequest {
    type: 'get';
    id: string;
    pk: string;
    callback: string;
    data: string[];
}

interface AuthSettingRequest {
    type: 'set';
    id: string;
    pk: string;
    callback: string;
    data: Record<string, string>;
}

type AuthRequest = AuthGettingRequest | AuthSettingRequest;

const AuthGetting = observer<FC<{ request: AuthGettingRequest; }>>(({ request }) => {
    const { identityStore, keyStore, userDataStore } = useStores();
    const alice = useAlice();
    const [checked, setChecked] = useState<Record<string, boolean>>({});
    const handleAuth = async () => {
        const data: Record<string, string> = {};
        Object.entries(checked).filter(([, value]) => value).forEach(([tag]) => {
            data[tag] = alice.reKey(request.pk, keyStore.dataKey[tag].sk);
        });
        await api.reEncrypt(identityStore.id, identityStore.key, request.callback, data);
    };

    const handleCheck = (event: ChangeEvent<HTMLInputElement>) => {
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

const AuthSetting = observer<FC<{ request: AuthSettingRequest; }>>(({request}) => {
    const { userDataStore, identityStore, notificationStore, keyStore } = useStores();
    const alice = useAlice();
    const deltaDataStore = useLocalStore(
        () => ({
            data: Object.fromEntries(Object.entries(request.data).map(([k, v]) => [k, { value: v, tag: '' }])),
            get dataArray() {
                return Object.entries(deltaDataStore.data).map(([key, { value, tag }]) => ({ key, value, tag }));
            },
            set(key: string, value: string, tag: string) {
                deltaDataStore.data[key] = { value, tag };
            },
            del(name: string) {
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
                    // eslint-disable-next-line @typescript-eslint/require-await
                    onRowDelete: async ({ key }) => deltaDataStore.del(key),
                    // eslint-disable-next-line @typescript-eslint/require-await
                    onRowAdd: async ({ key, value, tag }) => deltaDataStore.set(key, value, tag),
                    // eslint-disable-next-line @typescript-eslint/require-await
                    onRowUpdate: async ({ key, value, tag }, oldData) => {
                        oldData && oldData.key !== key && deltaDataStore.del(oldData.key);
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

export const Auth = observer<FC<RouteComponentProps>>(() => {
    const { identityStore } = useStores();
    const request = useUrlParams<AuthRequest>('request');
    useUserData();

    return (!identityStore.id || !request) ? <Redirect to='/' noThrow /> : (
        <Card>
            <CardHeader title='授权应用' />
            {request.type === 'get' ? <AuthGetting request={request} /> : <AuthSetting request={request}/>}
        </Card>
    );
});
