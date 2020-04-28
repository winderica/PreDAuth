import React from 'react';
import { Button, Card, CardContent, TextField, Typography } from '@material-ui/core';

import { useStyles } from '../styles/login';

export const Login = () => {
    const classes = useStyles();
    return (
        <>
            <div className={classes.container}>
                <div className={classes.header}>
                    <Typography variant='h1' color='textSecondary'>App</Typography>
                    <Typography variant='h4' color='textSecondary'>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                        incididunt ut labore et dolore magna aliqua.
                    </Typography>
                </div>
                <Card className={classes.card}>
                    <CardContent className={classes.content}>
                        <TextField variant="outlined" label='Email' fullWidth />
                        <TextField variant="outlined" label='Username' fullWidth />
                        <TextField variant="outlined" label='Password' type='password' fullWidth />
                        <Button fullWidth variant="contained" color="primary">Sign Up</Button>
                        <Button fullWidth variant="contained" color="secondary">Or Login via PreDAuth</Button>
                    </CardContent>
                </Card>
            </div>
        </>
    );
};
