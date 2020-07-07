import React, { ChangeEvent, FC, useState } from 'react';
import { observer } from 'mobx-react';
import { Redirect, RouteComponentProps } from '@reach/router';
import { Button, Card, CardActions, CardContent, CardHeader, Checkbox, FormControlLabel, Typography } from '@material-ui/core';

import { Table } from '../components/Table';
import { useAlice } from '../hooks/useAlice';
import { useStores } from '../hooks/useStores';
import { useUserData } from '../hooks/useUserData';
import { useUrlParams } from '../hooks/useUrlParams';
import { api } from '../api';
import { UserDataStore } from '../stores';
import { apiWrapper } from '../utils/apiWrapper';
import { encrypt } from '../utils/aliceWrapper';

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
    const [checked, setChecked] = useState<Record<string, boolean | undefined>>({});
    const handleAuth = async () => {
        const data: Record<string, string> = {};
        Object.entries(checked).filter(([, value]) => value).forEach(([tag]) => {
            data[tag] = alice.reKey(request.pk, keyStore.dataKey[tag].sk);
        });
        await apiWrapper(
            () => api.reEncrypt(identityStore.id, identityStore.key, request.callback, data),
            '正在提交重加密密钥',
            '成功提交重加密密钥'
        );
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

const AuthSetting = observer<FC<{ request: AuthSettingRequest; }>>(({ request }) => {
    const { userDataStore, identityStore, keyStore } = useStores();
    const alice = useAlice();
    const deltaDataStore = new UserDataStore(Object.fromEntries(Object.entries(request.data).map(([k, v]) => [k, { value: v, tag: '' }])));
    const handleAuth = async () => {
        deltaDataStore.dataArray.forEach(({ key, value, tag }) => userDataStore.set(key, value, tag));
        const { dataKey, encrypted } = await encrypt(alice, userDataStore.dataArrayGroupedByTag);
        await apiWrapper(async () => {
            await api.setData(identityStore.id, identityStore.key, encrypted);
            await keyStore.set(dataKey);
        }, '正在提交加密数据', '成功加密并提交');
    };

    return <>
        <CardContent>
            <Typography>应用{request.id}想要更新您的以下数据：</Typography>
            <Table title='更新信息' dataStore={deltaDataStore} />
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

    return !identityStore.id || !request ? <Redirect to='/' noThrow /> : (
        <Card>
            <CardHeader title='授权应用' />
            {request.type === 'get' ? <AuthGetting request={request} /> : <AuthSetting request={request} />}
        </Card>
    );
});
