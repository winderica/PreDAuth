import React, { useEffect, useState } from 'react';
import { ThemeProvider } from '@material-ui/core';

import { AliceProvider } from '../providers/alice';
import { LocationProvider, Router } from '@reach/router';
import { Data } from './Data';
import { useStores } from '../hooks/useStores';
import { Frame } from '../components/Frame';
import { theme, useStyles } from '../styles/global';
import { Auth } from './Auth';
import { API } from '../constants';

const id = 'alice';

export const App = () => {
    useStyles();
    const { identityStore } = useStores();
    const [initialized, setInitialized] = useState(false);
    useEffect(() => {
        (async () => {
            await fetch(API.register, {
                method: 'POST',
                body: JSON.stringify({ id }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            identityStore.set(id);
            setInitialized(true);
        })();
    }, []);
    return initialized && (
        <LocationProvider>
            <ThemeProvider theme={theme}>
                <AliceProvider>
                    <Frame>
                        <Router>
                            <Data path='/data' />
                            <Auth path='/auth' />
                        </Router>
                    </Frame>
                </AliceProvider>
            </ThemeProvider>
        </LocationProvider>
    );
};
