import { LinearProgress } from '@material-ui/core';
import React, { FC } from 'react';

import useStyles from '../styles/progress';

export const Progress: FC = () => {
    const classes = useStyles();
    return (
        <LinearProgress color='secondary' className={classes.progress} />
    );
};
