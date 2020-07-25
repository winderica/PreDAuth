import { Button, Card, Checkbox, FormControlLabel, IconButton, Step, StepContent, StepLabel, Stepper } from '@material-ui/core';
import { ArrowForward } from '@material-ui/icons';
import { Redirect, RouteComponentProps } from '@reach/router';
import { observer } from 'mobx-react';
import React, { ChangeEvent, FC, useState } from 'react';

import { Highlight } from '../components/Highlight';
import { Encrypted, PreKeyPair } from '../constants/types';
import { useAlice } from '../hooks/useAlice';
import { useStores } from '../hooks/useStores';
import { useUserData } from '../hooks/useUserData';
import { useStyles } from '../styles/debug';
import { encrypt } from '../utils/aliceBobWrapper';
import { Bob } from '../utils/bob';

const formatJSON = (object: unknown) => JSON.stringify(object, null, '  ');

export const Debug = observer<FC<RouteComponentProps>>(() => {
    const classes = useStyles();
    const { identityStore, userDataStore } = useStores();
    const alice = useAlice();
    useUserData();
    const bob = new Bob(alice.pre, alice.g, alice.h);
    const [activeStep, setActiveStep] = useState(0);
    const [checked, setChecked] = useState<Record<string, boolean | undefined>>({});
    const [dataKey, setDataKey] = useState<Record<string, PreKeyPair>>({});
    const [encrypted, setEncrypted] = useState<Record<string, Encrypted>>({});
    const [rk, setRk] = useState<Record<string, string>>({});
    if (!identityStore.id) {
        return <Redirect to='/' noThrow />;
    }
    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };
    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };
    const handleCheck = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = event.target;
        setChecked((prevChecked) => ({ ...prevChecked, [name]: checked }));
    };
    const handleEncrypt = async () => {
        const { dataKey, encrypted } = await encrypt(alice, userDataStore.dataArrayGroupedByTag);
        setDataKey(dataKey);
        setEncrypted(encrypted);
    };
    const handleRkGen = () => {
        setRk(Object.fromEntries(
            userDataStore.tags
                .filter((tag) => checked[tag])
                .map((tag) => [tag, alice.reKey(bob.key.pk, dataKey[tag].sk)])
        ));
    };
    const steps = [
        {
            title: 'Encrypt',
            content: <div className={classes.container}>
                <div className={classes.left}>
                    <Highlight language='json'>{formatJSON(userDataStore.dataGroupedByTag)}</Highlight>
                </div>
                <IconButton onClick={handleEncrypt}>
                    <ArrowForward />
                </IconButton>
                <div className={classes.right}>
                    <Highlight language='json'>{formatJSON(dataKey)}</Highlight>
                    <Highlight language='json'>{formatJSON(encrypted)}</Highlight>
                </div>
            </div>
        },
        {
            title: 'Generate Re-Encrypt Key',
            content: <div className={classes.container}>
                <div className={classes.left}>
                    <Highlight language='json'>{
                        formatJSON(Object.fromEntries(Object.entries(dataKey).filter(([tag]) => checked[tag])))
                    }</Highlight>
                    {userDataStore.tags.map((tag) => <FormControlLabel
                        control={<Checkbox checked={!!checked[tag]} onChange={handleCheck} name={tag} />}
                        label={tag}
                        key={tag}
                    />)}
                </div>
                <IconButton onClick={handleRkGen}>
                    <ArrowForward />
                </IconButton>
                <div className={classes.right}>
                    <Highlight language='json'>{formatJSON(rk)}</Highlight>
                </div>
            </div>
        },
        {
            title: 'Re-Encrypt',
            content: <></>
        },
        {
            title: 'Re-Decrypt',
            content: <></>
        },
    ];

    const checkDisabled = (step: number) => {
        switch (step) {
            case steps.length - 1:
                return true;
            case 0:
                return !Object.keys(dataKey).length;
            case 1:
                return !Object.keys(rk).length;
            default:
                return false;
        }
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
                                    disabled={checkDisabled(activeStep)}
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
