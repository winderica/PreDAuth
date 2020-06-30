import React from 'react';
import { SnackbarProvider } from 'notistack';
import { ThemeProvider } from '@material-ui/core';
import { LocationProvider, Router } from '@reach/router';

import { AliceProvider } from '../providers/alice';
import { Frame } from '../components/Frame';
import { theme, useStyles } from '../styles/global';
import { Auth } from './Auth';
import { Backup } from './Backup';
import { Data } from './Data';
import { Home } from './Home';
import { Register } from './Register';

export const App = () => {
    useStyles();
    return (
        <SnackbarProvider>
            <LocationProvider>
                <ThemeProvider theme={theme}>
                    <Frame>
                        <AliceProvider>
                            <Router>
                                <Home path='/' />
                                <Data path='/data' />
                                <Auth path='/auth' />
                                <Backup path='/backup' />
                                <Register path='/register' />
                            </Router>
                        </AliceProvider>
                    </Frame>
                </ThemeProvider>
            </LocationProvider>
        </SnackbarProvider>
    );
};
