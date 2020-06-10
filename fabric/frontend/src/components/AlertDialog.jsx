import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';

export const AlertDialog = ({ open, setOpen }) => {
    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>初始化</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    请输入您的id（不可重复），我们将为您分配对应的公私钥
                </DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    label="id"
                    fullWidth
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary" autoFocus>
                    提交
                </Button>
            </DialogActions>
        </Dialog>
    );
};
