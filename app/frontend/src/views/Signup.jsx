import React, { useEffect, useState } from 'react';
import { Button, Card, CardContent, Paper, TextField, Typography } from '@material-ui/core';
import YouChat from '../assets/YouChat.png';

import { useStyles } from '../styles/signup';

export const Signup = () => {
    const classes = useStyles();
    const [appInfo, setAppInfo] = useState(null);
    useEffect(() => {
        void (async () => {
            const appInfo = await (await fetch(`${process.env.REACT_APP_APP_BACKEND}/appInfo`, { credentials: 'include' })).json();
            setAppInfo(appInfo);
        })();
    }, []);
    const handleClick = () => {
        window.location.href = `${process.env.REACT_APP_PREDAUTH_FRONTEND}/auth/?request=${encodeURIComponent(JSON.stringify({
            type: 'get',
            id: 'YouChat',
            pk: appInfo.pk,
            callback: appInfo.callback,
            redirect: `${process.env.REACT_APP_APP_FRONTEND}/dashboard`,
            data: appInfo.data,
        }))}`;
    };
    return appInfo && (
        <div className={classes.root}>
            <Paper className={classes.container} elevation={10}>
                <div className={classes.header}>
                    <img src={YouChat} alt='' className={classes.logo} />
                    <Typography variant='h2'>YouChat</Typography>
                    <Typography variant='h5'>不只是一种生活方式</Typography>
                </div>
                <Card className={classes.card} elevation={5}>
                    <CardContent className={classes.content}>
                        <TextField variant="outlined" label='邮箱' fullWidth />
                        <TextField variant="outlined" label='用户名' fullWidth />
                        <TextField variant="outlined" label='密码' type='password' fullWidth />
                        <Button fullWidth variant='contained' color='primary' size='large'>注册</Button>
                        <Button fullWidth variant='outlined' color='primary' size='large' onClick={handleClick}>使用PreDAuth登录</Button>
                        <Typography variant='caption' color='textSecondary'>* 注册即代表您同意我们的服务条款与隐私政策</Typography>
                    </CardContent>
                </Card>
            </Paper>
        </div>
    );
};
