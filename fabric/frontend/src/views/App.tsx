import { CssBaseline, ThemeProvider } from '@material-ui/core';
import { LocationProvider, Router } from '@reach/router';
import { SnackbarProvider } from 'notistack';
import React, { FC } from 'react';

import { Frame } from '../components/Frame';
import { AliceProvider } from '../providers/alice';
import { theme, useStyles } from '../styles/global';

import { Auth } from './Auth';
import { Backup } from './Backup';
import { Data } from './Data';
import { Debug } from './Debug';
import { Home } from './Home';
import { Recover } from './Recover';
import { Register } from './Register';

export const App: FC = () => {
    useStyles();
    return (
        <CssBaseline>
            <ThemeProvider theme={theme}>
                <SnackbarProvider maxSnack={5}>
                    <LocationProvider>
                        <Frame>
                            <AliceProvider>
                                <Router primary={false} component={({ children }) => <>{children}</>}>
                                    <Home path='/' />
                                    <Data path='/data' />
                                    <Auth path='/auth' />
                                    <Backup path='/backup' />
                                    <Register path='/register' />
                                    <Recover path='/recover' />
                                    <Debug path='/debug' />
                                </Router>
                            </AliceProvider>
                        </Frame>
                    </LocationProvider>
                </SnackbarProvider>
            </ThemeProvider>
        </CssBaseline>
    );
};
