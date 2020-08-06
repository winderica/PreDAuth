import { Checkbox as MuiCheckbox, FormControlLabel } from '@material-ui/core';
import React, { FC, ChangeEventHandler } from 'react';

interface Props {
    checked: boolean;
    name: string;
    disabled?: boolean;
    onCheck?: ChangeEventHandler<HTMLInputElement>;
}

export const Checkbox: FC<Props> = ({ checked, onCheck, name, disabled }) => {
    return (
        <FormControlLabel
            control={<MuiCheckbox checked={checked} onChange={onCheck} name={name} disabled={disabled} />}
            label={name}
        />
    );
};
