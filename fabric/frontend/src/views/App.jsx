import React, { useEffect, useState } from 'react';
import { SnackbarProvider } from 'notistack';
import { ThemeProvider } from '@material-ui/core';
import { LocationProvider, Router } from '@reach/router';

import { AliceProvider } from '../providers/alice';
import { useStores } from '../hooks/useStores';
import { Frame } from '../components/Frame';
import { theme, useStyles } from '../styles/global';
import { Auth } from './Auth';
import { Backup } from './Backup';
import { Data } from './Data';
import { API } from '../constants';
import { exportPublicKey, generateKey, sign } from '../utils/ecdsa';
import { random } from '../utils/random';

const id = 'alice';

export const App = () => {
    useStyles();
    const { identityStore } = useStores();
    const [initialized, setInitialized] = useState(false);
    useEffect(() => {
        (async () => {
            const key = await generateKey();
            const publicKey = await exportPublicKey(key);
            const nonce = random(32);
            const signature = await sign(nonce, key);
            await fetch(API.register, {
                method: 'POST',
                body: JSON.stringify({ id, nonce, signature, payload: { publicKey } }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            identityStore.set(id);
            setInitialized(true);
        })();
    }, []);
    return initialized && (
        <SnackbarProvider>
            <LocationProvider>
                <ThemeProvider theme={theme}>
                    <AliceProvider>
                        <Frame>
                            <Router>
                                <Data path='/data' />
                                <Auth path='/auth' />
                                <Backup path='/backup' />
                            </Router>
                        </Frame>
                    </AliceProvider>
                </ThemeProvider>
            </LocationProvider>
        </SnackbarProvider>
    );
};
