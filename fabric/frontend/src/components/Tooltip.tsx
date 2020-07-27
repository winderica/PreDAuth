import { Tooltip as MuiTooltip, TooltipProps } from '@material-ui/core';
import React, { FC } from 'react';

import { useStyles } from '../styles/tooltip';

export const Tooltip: FC<TooltipProps> = ({ children, title }) => {
    const classes = useStyles();
    return (
        <MuiTooltip interactive title={title} classes={{ tooltip: classes.tooltip }}>
            <div>
                {children}
            </div>
        </MuiTooltip>
    );
};
