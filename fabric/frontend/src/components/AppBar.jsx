import React from 'react';
import { useLocation } from '@reach/router';
import { AppBar as Bar, IconButton, Toolbar, Typography } from '@material-ui/core';
import { Menu } from '@material-ui/icons';

import { useStyles } from '../styles/appBar';

export const AppBar = ({ open, toggleOpen }) => {
    const classes = useStyles({ open });
    const location = useLocation();
    return (
        <Bar position='fixed' className={classes.appBar}>
            <Toolbar disableGutters={!open} classes={{ gutters: classes.appBarGutters, regular: classes.regular }}>
                <IconButton
                    color='inherit'
                    onClick={toggleOpen}
                    className={classes.menuButton}
                >
                    <Menu />
                </IconButton>
                <Typography variant='h6' color='inherit' noWrap>{location.pathname}</Typography>
            </Toolbar>
        </Bar>
    );
};
