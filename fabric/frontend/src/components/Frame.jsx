import React, { useState } from 'react';

import { AppBar } from './AppBar';
import { Menu } from './Menu';

import { useStyles } from '../styles/frame';
import { Backup, Fingerprint, List } from '@material-ui/icons';

const listItems = [
    { to: '/data', text: 'data', icon: <List /> },
    { to: '/auth', text: 'auth', icon: <Fingerprint /> },
    { to: '/backup', text: 'backup', icon: <Backup /> },
];

export const Frame = ({ children }) => {
    const classes = useStyles();
    const [open, setOpen] = useState(false);

    const handleClick = () => {
        open && setOpen(false);
    };

    const toggleOpen = () => {
        setOpen((open) => !open);
    };

    return (
        <div className={classes.root}>
            <AppBar open={open} toggleOpen={toggleOpen} />
            <Menu items={listItems} open={open} toggleOpen={toggleOpen} />
            <main className={classes.content} onClick={handleClick}>
                {children}
            </main>
        </div>
    );
};
