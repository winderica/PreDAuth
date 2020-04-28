import React from 'react';
import { Dashboard } from './Dashboard';
import { Login } from './Login';
import { theme, useStyles } from '../styles/global';
import { Router } from '@reach/router';
import { ThemeProvider } from '@material-ui/core';


export const Index = () => {
    useStyles();
    return (
        <ThemeProvider theme={theme}>
            <Router>
                <Login path="/" />
                <Dashboard path="/aaa" />
            </Router>
        </ThemeProvider>
    );
};
