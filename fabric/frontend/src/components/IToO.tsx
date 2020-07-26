import { IconButton, Slide } from '@material-ui/core';
import { ArrowBack, ArrowForward } from '@material-ui/icons';
import React, { FC, useState } from 'react';

import { useStyles } from '../styles/iToO';

interface Props {
    left: JSX.Element;
    right: JSX.Element;
    onClick: () => void;
}

export const IToO: FC<Props> = ({ left, right, onClick }) => {
    const classes = useStyles();
    const [checked, setChecked] = useState(true);
    const [showingLeft, setShowingLeft] = useState(true);

    const handleForward = () => {
        setChecked((prevChecked) => !prevChecked);
        onClick();
    };
    const handleBack = () => {
        setChecked((prevChecked) => !prevChecked);
    };
    const handleExit = () => {
        setShowingLeft((prevShowingLeft) => !prevShowingLeft);
    };

    return (
        <div className={classes.container}>
            {showingLeft
                ? <Slide direction='right' in={checked} onExited={handleExit}>
                    <div className={classes.content}>
                        <div className={classes.part}>{left}</div>
                        <IconButton onClick={handleForward}><ArrowForward /></IconButton>
                    </div>
                </Slide>
                : <Slide direction='left' in={!checked} onExited={handleExit}>
                    <div className={classes.content}>
                        <IconButton onClick={handleBack}><ArrowBack /></IconButton>
                        <div className={classes.part}>{right}</div>
                    </div>
                </Slide>
            }
        </div>
    );
};
