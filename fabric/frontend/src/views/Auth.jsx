import React, { useContext, useState } from 'react';
import { AliceContext } from '../contexts';
import { Button, Card, CardActions, CardContent, CardHeader, Checkbox, FormControlLabel, Typography } from '@material-ui/core';
import { useStores } from '../hooks/useStores';
import { API } from '../constants';
import { observer } from 'mobx-react';

export const Auth = observer(() => {
    const { userDataStore, identityStore, keyStore } = useStores();
    const [checked, setChecked] = useState({});
    const alice = useContext(AliceContext);

    const reEncrypt = async () => {
        const { pk } = await (await fetch('http://127.0.0.1:4001/pk')).json();
        const data = {};
        Object.entries(checked).filter(([, value]) => value).forEach(([tag]) => {
            data[tag] = alice.reKey(pk, keyStore.key[tag].sk);
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
                <Typography>应用YouChat想要获取您如下标签的数据：</Typography>
                {Object.keys(keyStore.key).map((tag) => <FormControlLabel
                    control={<Checkbox checked={!!checked[tag]} onChange={handleCheck} name={tag} />}
                    label={tag}
                    key={tag}
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
                <Button onClick={reEncrypt} variant="contained" color="primary">授权登录</Button>
            </CardActions>
        </Card>
    );
});
