import React, { FC, useEffect, useState } from 'react';
import { Avatar, Card, CardContent, CardHeader, Divider, Typography } from '@material-ui/core';
import { useStyles } from '../styles/dashboard';
import { RouteComponentProps } from '@reach/router';

interface Data {
    name: string;
    avatar: string;
    bio: string;
    city: string;
}

const isValid = (data: Data | null) => {
    return Boolean(data && data.name && data.avatar && data.bio && data.city);
};

export const Dashboard: FC<RouteComponentProps> = ({ navigate }) => {
    const [data, setData] = useState<Data | null>(null);
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
            </Card>
        </div>
    ) : null;
};
