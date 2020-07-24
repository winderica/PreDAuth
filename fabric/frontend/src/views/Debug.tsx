import { Button, Card, IconButton, Step, StepContent, StepLabel, Stepper } from '@material-ui/core';
import { ArrowForward } from '@material-ui/icons';
import { Redirect, RouteComponentProps } from '@reach/router';
import { observer } from 'mobx-react';
import React, { ChangeEvent, FC, useState } from 'react';

import { Highlight } from '../components/Highlight';
import { useAlice } from '../hooks/useAlice';
import { useStores } from '../hooks/useStores';
import { useUserData } from '../hooks/useUserData';
import { useStyles } from '../styles/debug';
import { Encrypted, PreKeyPair } from '../utils/alice';
import { encrypt } from '../utils/aliceWrapper';

export const Debug = observer<FC<RouteComponentProps>>(() => {
    const { identityStore, userDataStore } = useStores();
    const [checked, setChecked] = useState<Record<string, boolean | undefined>>({});
    const [dataKey, setDataKey] = useState<Record<string, PreKeyPair>>({});
    const [encrypted, setEncrypted] = useState<Record<string, Encrypted>>({});
    const alice = useAlice();
    const classes = useStyles();
    if (!identityStore.id) {
        return <Redirect to='/' noThrow />;
    }
    const handleCheck = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = event.target;
        setChecked((prevChecked) => ({ ...prevChecked, [name]: checked }));
    };
    useUserData();
    const handleEncrypt = async () => {
        const { dataKey, encrypted } = await encrypt(alice, userDataStore.dataArrayGroupedByTag);
        setDataKey(dataKey);
        setEncrypted(encrypted);
    };
    const steps = [
        {
            title: 'Encrypt', content: <div className={classes.container}>
                <div className={classes.left}>
                    <Highlight language='json'>{
                        JSON.stringify(userDataStore.dataGroupedByTag, null, '  ')
                    }</Highlight>
                </div>
                <IconButton onClick={handleEncrypt}>
                    <ArrowForward />
                </IconButton>
                <div className={classes.right}>
                    <Highlight language='json'>{
                        JSON.stringify(dataKey, null, '  ')
                    }</Highlight>
                    <Highlight language='json'>{
                        JSON.stringify(encrypted, null, '  ')
                    }</Highlight>
                </div>
            </div>
        },
        { title: 'Generate Re-Encrypt Key', content: <></> },
        { title: 'Re-Encrypt', content: <></> },
        { title: 'Re-Decrypt', content: <></> },
    ];
    const [activeStep, setActiveStep] = useState(0);

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    return (
        <Card>
            <Stepper activeStep={activeStep} orientation='vertical'>
                {steps.map(({ title, content }, index) => (
                    <Step key={index}>
                        <StepLabel>{title}</StepLabel>
                        <StepContent>
                            {content}
                            <div>
                                <Button disabled={activeStep === 0} onClick={handleBack}>
                                    Back
                                </Button>
                                <Button
                                    variant='contained'
                                    color='primary'
                                    onClick={handleNext}
                                    disabled={activeStep === steps.length - 1}
                                >
                                    Next
                                </Button>
                            </div>
                        </StepContent>
                    </Step>
                ))}
            </Stepper>
        </Card>
    );
});
