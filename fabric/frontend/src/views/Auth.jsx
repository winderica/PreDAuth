import React, { useContext, useState } from 'react';
import { AliceContext } from '../contexts';
import { Button, Card, CardActions, CardContent, CardHeader, Checkbox, FormControlLabel, Typography } from '@material-ui/core';
import { useStores } from '../hooks/useStores';
import { API } from '../constants';

export const Auth = () => {
    const { identityStore, keyStore } = useStores();
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
            <CardHeader title='Authorize app' />
            <CardContent>
                <Typography>App wants to access your:</Typography>
                {Object.keys(keyStore.key).map((tag) => <FormControlLabel
                    control={<Checkbox checked={!!checked[tag]} onChange={handleCheck} name={tag} />}
                    label={tag}
                    key={tag}
                />)}
            </CardContent>
            <CardActions>
                <Button onClick={reEncrypt} variant="contained" color="primary">reEncrypt</Button>
            </CardActions>
        </Card>
    );
};
