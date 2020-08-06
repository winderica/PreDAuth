import React, { FC, useEffect, useState } from 'react';
import { Avatar, Button, Card, CardActions, CardContent, CardHeader, Divider, Tooltip, Typography } from '@material-ui/core';
import { useStyles } from '../styles/dashboard';
import { RouteComponentProps } from '@reach/router';
import { useAppInfo } from '../providers/appInfo';

interface Data {
    name: string;
    avatar: string;
    bio: string;
    city: string;
    id: string;
}

const isValid = (data: Data | null) => {
    return Boolean(data && data.name && data.avatar && data.bio && data.city && data.id);
};

export const Dashboard: FC<RouteComponentProps> = ({ navigate }) => {
    const [data, setData] = useState<Data | null>(null);
    const appInfo = useAppInfo();
    useEffect(() => {
        void (async () => {
            const { data } = await (await fetch(`${process.env.REACT_APP_APP_BACKEND}/data`, { credentials: 'include' })).json();
            setData(data);
            if (!isValid(data)) {
                if (!navigate) {
                    throw new Error('How could this happen?');
                }
                await navigate('/');
            }
        })();
    }, [navigate]);
    const handleClick = () => {
        window.location.href = `${process.env.REACT_APP_PREDAUTH_FRONTEND}/auth/?request=${encodeURIComponent(JSON.stringify({
            type: 'set',
            id: 'YouChat',
            pk: appInfo.pk,
            callback: appInfo.callback,
            redirect: `${process.env.REACT_APP_APP_FRONTEND}/dashboard`,
            data: {
                YouChatID: data?.id
            },
        }))}`;
    };
    const classes = useStyles();
    return data && isValid(data) ? (
        <div className={classes.root}>
            <Card elevation={10}>
                <CardHeader title='Welcome' />
                <Divider variant='middle' />
                <CardContent className={classes.content}>
                    <Avatar className={classes.avatar} src={data.avatar} alt={data.name}>{data.name.split(' ').map(i => i[0]).join('')}</Avatar>
                    <div className={classes.profile}>
                        <Typography variant='h4'>{data.name}</Typography>
                        <Typography variant='body1' color='textSecondary'>{data.city}</Typography>
                        <Typography variant='body2' color='textSecondary'>{data.bio}</Typography>
                    </div>
                </CardContent>
                <CardActions className={classes.buttonContainer}>
                    <Tooltip title='为您在PreDAuth中设置YouChat ID，以供其它应用获取'>
                        <Button onClick={handleClick} variant='outlined' color='primary'>连携</Button>
                    </Tooltip>
                    <Button variant='contained' color='primary'>完成</Button>
                </CardActions>
            </Card>
        </div>
    ) : null;
};
