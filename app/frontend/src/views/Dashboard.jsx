import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, Divider, Typography } from '@material-ui/core';
import { useStyles } from '../styles/dashboard';

export const Dashboard = () => {
    const [data, setData] = useState(null);
    useEffect(() => {
        void (async () => {
            const { data } = await (await fetch(`${process.env.REACT_APP_APP_BACKEND}/data`, { credentials: 'include' })).json();
            setData(data);
        })();
    }, []);
    const classes = useStyles();
    return data && (
        <div className={classes.root}>
            <Card elevation={10}>
                <CardHeader title='授权信息确认' />
                <Divider variant='middle' />
                <CardContent>
                    <div>
                        {Object.entries(data).map(([k, v]) => <>
                            <Typography variant='h6'>{k}</Typography>
                            <Typography variant='body1' color='textSecondary'>{v}</Typography>
                        </>)}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
