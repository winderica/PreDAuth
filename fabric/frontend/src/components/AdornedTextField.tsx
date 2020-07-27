import { InputAdornment, TextField } from '@material-ui/core';
import React, { FC } from 'react';

interface Props {
    label: string;
    value: string;
}

export const AdornedTextField: FC<Props> = ({ label, value, children }) => {
    return (
        <TextField
            spellCheck={false}
            label={label}
            InputProps={{
                startAdornment: <InputAdornment position='start'>{children}</InputAdornment>
            }}
            fullWidth
            margin='dense'
            value={value}
        />
    );
};
