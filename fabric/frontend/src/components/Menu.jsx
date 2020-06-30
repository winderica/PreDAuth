import React from 'react';

import { Divider, Drawer, IconButton, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { ChevronLeft } from '@material-ui/icons';

import { useStyles } from '../styles/menu';

import { Anchor } from './Anchor';

export const Menu = ({ open, toggleOpen, items }) => {
    const classes = useStyles({ open });

    return (
        <Drawer
            variant='permanent'
            classes={{ paper: classes.drawerPaper }}
            open={open}
        >
            <div className={classes.toolbar}>
                <IconButton onClick={toggleOpen}>
                    <ChevronLeft />
                </IconButton>
            </div>
            <Divider />
            <List>
                {items.map(({ to, text, icon }, index) =>
                    <Anchor to={to} key={index}>
                        <ListItem button onClick={open ? toggleOpen : undefined}>
                            <ListItemIcon className={classes.icon}>
                                {icon}
                            </ListItemIcon>
                            <ListItemText primary={text} />
                        </ListItem>
                    </Anchor>,
                )}
            </List>
        </Drawer>
    );
};
