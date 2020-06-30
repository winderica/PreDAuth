import React, { useState } from 'react';
import { Button, Card, CardActions, CardContent, CardHeader, Checkbox, FormControlLabel, Typography } from '@material-ui/core';
import { useStores } from '../hooks/useStores';
import TextField from '@material-ui/core/TextField';
import { Redirect } from '@reach/router';

export const Backup = () => {
    const { identityStore, keyStore } = useStores();
    if (!identityStore.id) {
        return <Redirect to='/' noThrow />;
    }
    const [checked, setChecked] = useState({});

    const handleCheck = (event) => {
        setChecked((prevChecked) => ({ ...prevChecked, [event.target.name]: event.target.checked }));
    };
    return (
        <Card>
            <CardHeader title='备份数据' />
            <CardContent>
                <Typography>您可以输入恢复手段（邮箱或手机号），并指定允许PreDAuth获取的数据，为PreDAuth生成重加密密钥，以便于私钥丢失后仍能找回相应数据。</Typography>
                <Typography>对于敏感数据，您可以选择不信任PreDAuth，而是选择自己记忆，并承担私钥丢失的后果。</Typography>
                <TextField
                    autoFocus
                    margin='dense'
                    label='恢复手段'
                    fullWidth
                />
                {Object.keys(keyStore.dataKey).map((tag) => <FormControlLabel
                    control={<Checkbox checked={!!checked[tag]} onChange={handleCheck} name={tag} />}
                    label={tag}
                    key={tag}
                />)}
            </CardContent>
            <CardActions>
                <Button variant='contained' color='primary'>备份</Button>
            </CardActions>
        </Card>
    );
};
