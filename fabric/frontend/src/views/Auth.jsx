import React, { useContext, useEffect, useState } from 'react';
import { AliceContext } from '../contexts';
import { Button, Card, CardActions, CardContent, CardHeader, Checkbox, FormControlLabel, Typography } from '@material-ui/core';
import { useStores } from '../hooks/useStores';
import { API } from '../constants';
import { observer } from 'mobx-react';
import { Redirect } from '@reach/router';

export const Auth = observer(() => {
    const { identityStore, keyStore, userDataStore, notificationStore } = useStores();
    if (!identityStore.id) {
        return <Redirect to='/' noThrow />;
    }
    const [checked, setChecked] = useState({});
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
    const reEncrypt = async () => {
        const { pk } = await (await fetch('http://127.0.0.1:4001/pk')).json();
        const data = {};
        Object.entries(checked).filter(([, value]) => value).forEach(([tag]) => {
            data[tag] = alice.reKey(pk, keyStore.dataKey[tag].sk);
        });
        await fetch(API.reEncrypt(identityStore.id, 'http://127.0.0.1:4001/decrypt'), {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        });
    };

    const handleCheck = (event) => {
        setChecked((prevChecked) => ({ ...prevChecked, [event.target.name]: event.target.checked }));
    };
    return (
        <Card>
            <CardHeader title='授权应用' />
            <CardContent>
                <Typography>为应用生成重加密密钥，将您保存在PreDAuth上的数据安全地发送给应用。</Typography>
                <Typography>应用YouChat想要获取您的如下数据：</Typography>
                {Object.keys(userDataStore.data).map((key) => <FormControlLabel
                    control={<Checkbox checked={!!checked[key]} onChange={handleCheck} name={key} />}
                    label={key}
                    key={key}
                />)}
                {/*<Typography>应用YouChat想要更新您的以下数据：</Typography>*/}
                {/*<Table*/}
                {/*    columns={[*/}
                {/*        { title: '键', field: 'key', grouping: false },*/}
                {/*        { title: '值', field: 'value', grouping: false },*/}
                {/*        { title: '标签', field: 'tag' },*/}
                {/*    ]}*/}
                {/*    title='个人信息'*/}
                {/*    data={userDataStore.dataArray}*/}
                {/*    editable={{*/}
                {/*        onRowDelete: async ({ key }) => userDataStore.del(key),*/}
                {/*        onRowAdd: async ({ key, value, tag }) => userDataStore.set(key, value, tag),*/}
                {/*        onRowUpdate: async ({ key, value, tag }, { key: oldKey }) => {*/}
                {/*            oldKey !== key && userDataStore.del(oldKey);*/}
                {/*            userDataStore.set(key, value, tag);*/}
                {/*        }*/}
                {/*    }}*/}
                {/*/>*/}
            </CardContent>
            <CardActions>
                <Button onClick={reEncrypt} variant='contained' color='primary'>授权登录</Button>
            </CardActions>
        </Card>
    );
});
