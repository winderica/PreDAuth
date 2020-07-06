import React, { FC, useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { Backup, Fingerprint, List } from '@material-ui/icons';

import { AppBar } from './AppBar';
import { Menu } from './Menu';
import { Notifier } from './Notifier';

import { useStores } from '../hooks/useStores';
import { useStyles } from '../styles/frame';
import { Progress } from './Progress';

const listItems = [
    { to: '/data', text: 'data', icon: <List /> },
    { to: '/auth', text: 'auth', icon: <Fingerprint /> },
    { to: '/backup', text: 'backup', icon: <Backup /> },
];

export const Frame = observer<FC>(({ children }) => {
    const classes = useStyles();
    const { identityStore, keyStore, componentStateStore } = useStores();
    const [open, setOpen] = useState(false);
    const [initialized, setInitialized] = useState(false);

    const handleClick = () => {
        open && setOpen(false);
    };

    const toggleOpen = () => {
        setOpen((open) => !open);
    };

    useEffect(() => {
        void (async () => {
            await identityStore.load();
            await keyStore.load();
            setInitialized(true);
        })();
    }, []);
    return initialized ? (
        <div className={classes.root}>
            <AppBar open={open} toggleOpen={toggleOpen} />
            <Menu items={listItems} open={open} toggleOpen={toggleOpen} />
            <main className={classes.content} onClick={handleClick}>
                {children}
            </main>
            {componentStateStore.progressOn && <Progress />}
            <Notifier />
        </div>
    ) : null;
});
