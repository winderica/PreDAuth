import { Chip, ChipProps } from '@material-ui/core';
import { Face } from '@material-ui/icons';
import React, { FC } from 'react';

export const ChipWithFace: FC<ChipProps> = ({ label, color }) => {
    return (
        <Chip icon={<Face />} label={label} color={color} size='small' />
    );
};
