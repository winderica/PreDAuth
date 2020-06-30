import React from 'react';
import { Dialog as MuiDialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core';

export const Dialog = ({ open, setOpen, title, content, actions }) => {
    const handleClose = () => {
        setOpen(false);
    };

    return (
        <MuiDialog open={open} onClose={handleClose}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                {content}
            </DialogContent>
            <DialogActions>
                {actions}
            </DialogActions>
        </MuiDialog>
    );
};
