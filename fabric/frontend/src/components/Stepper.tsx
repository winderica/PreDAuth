import { Button, Step, StepContent, StepLabel, Stepper as MuiStepper } from '@material-ui/core';
import { observer } from 'mobx-react';
import React, { FC, useState } from 'react';

import { useStyles } from '../styles/stepper';

interface Props {
    steps: {
        chip: JSX.Element;
        title: string | JSX.Element;
        content: string | JSX.Element;
    }[];
    checkDisabled: (step: number) => boolean;
}

export const Stepper = observer<FC<Props>>(({ steps, checkDisabled }) => {
    const [step, setStep] = useState(0);
    const classes = useStyles();
    const handleNext = () => {
        setStep((prevStep) => prevStep + 1);
    };
    const handleBack = () => {
        setStep((prevStep) => prevStep - 1);
    };
    return (
        <MuiStepper activeStep={step} orientation='vertical'>
            {steps.map(({ title, chip, content }, index) => (
                <Step key={index}>
                    <StepLabel>
                        <div className={classes.title}>
                            <div className={classes.chip}>{chip}</div>
                            {title}
                        </div>
                    </StepLabel>
                    <StepContent>
                        {content}
                        <Button disabled={!step} onClick={handleBack}>
                            Back
                        </Button>
                        <Button
                            variant='contained'
                            color='primary'
                            onClick={handleNext}
                            disabled={checkDisabled(step)}
                        >
                            Next
                        </Button>
                    </StepContent>
                </Step>
            ))}
        </MuiStepper>
    );
});
