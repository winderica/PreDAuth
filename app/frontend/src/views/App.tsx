import React from 'react';
import { Dashboard } from './Dashboard';
import { Signup } from './Signup';
import { theme, useStyles } from '../styles/global';
import { Router } from '@reach/router';
import { ThemeProvider } from '@material-ui/core';
import { AppInfoProvider } from '../providers/appInfo';

export const App = () => {
    useStyles();
    return (
        <ThemeProvider theme={theme}>
            <AppInfoProvider>
                <Router>
                    <Signup path='/' />
                    <Dashboard path='/dashboard' />
                </Router>
            </AppInfoProvider>
        </ThemeProvider>
    );
};
