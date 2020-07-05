import React, { FC } from 'react';
import { Dialog as MuiDialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core';

interface Props {
    open: boolean;
    setOpen: (open: boolean) => void;
    title: string;
    content: string | JSX.Element;
    actions: string | JSX.Element;
}

export const Dialog: FC<Props> = ({ open, setOpen, title, content, actions }) => {
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
