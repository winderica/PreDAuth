import { Card, Checkbox, Chip, FormControlLabel } from '@material-ui/core';
import { Face } from '@material-ui/icons';
import { Redirect, RouteComponentProps } from '@reach/router';
import { observer } from 'mobx-react';
import React, { ChangeEvent, FC, useState } from 'react';

import { Highlighter } from '../components/Highlighter';
import { IToO } from '../components/IToO';
import { Stepper } from '../components/Stepper';
import { Encrypted, PreKeyPair, ReEncrypted } from '../constants/types';
import { useAlice } from '../hooks/useAlice';
import { useStores } from '../hooks/useStores';
import { useUserData } from '../hooks/useUserData';
import { encrypt, reDecrypt } from '../utils/aliceBobWrapper';
import { Bob } from '../utils/bob';

const formatJSON = (object: unknown, indent = 2) => JSON.stringify(object, null, ' '.repeat(indent));

export const Debug = observer<FC<RouteComponentProps>>(() => {
    const { identityStore, userDataStore } = useStores();
    const alice = useAlice();
    useUserData();
    const [bob] = useState(new Bob(alice.pre, alice.g, alice.h));
    const [encrypted, setEncrypted] = useState<Record<string, Encrypted>>({});
    const [dataKey, setDataKey] = useState<Record<string, PreKeyPair>>({});
    const [checked, setChecked] = useState<Record<string, boolean | undefined>>({});
    const [rk, setRk] = useState<Record<string, string>>({});
    const [reEncrypted, setReEncrypted] = useState<Record<string, ReEncrypted>>({});
    const [reDecrypted, setReDecrypted] = useState<{ key: string; value: string; tag: string; }[]>([]);
    if (!identityStore.id) {
        return <Redirect to='/' noThrow />;
    }

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
    const handleReEncrypt = () => {
        setReEncrypted(Object.fromEntries(Object.entries(rk).map(([tag, rk]) => {
            const { key: { ca0, ca1 }, data, iv } = encrypted[tag];
            const { cb0, cb1 } = alice.pre.reEncrypt({
                ca0: alice.pre.deserialize(ca0, 'Fr'),
                ca1: alice.pre.deserialize(ca1, 'G1')
            }, alice.pre.deserialize(rk, 'G2'));
            return [tag, { data, key: { cb0: alice.pre.serialize(cb0), cb1: alice.pre.serialize(cb1) }, iv }];
        })));
    };
    const handleReDecrypt = async () => {
        setReDecrypted(await reDecrypt(bob, reEncrypted));
    };

    const checkDisabled = (step: number) => {
        switch (step) {
            case steps.length - 1:
                return true;
            case 0:
                return !Object.keys(dataKey).length;
            case 1:
                return !Object.keys(rk).length;
            case 2:
                return !Object.keys(reEncrypted).length;
            default:
                return false;
        }
    };
    const steps = [
        {
            chip: <Chip icon={<Face />} label='Alice' color='secondary' size='small' />,
            title: 'Encrypt',
            content: <IToO
                left={
                    <Highlighter language='json'>{formatJSON(userDataStore.dataGroupedByTag)}</Highlighter>
                }
                right={
                    <>
                        <Highlighter language='json'>{formatJSON(dataKey)}</Highlighter>
                        <Highlighter language='json'>{formatJSON(encrypted)}</Highlighter>
                    </>
                }
                onClick={handleEncrypt}
            />
        },
        {
            chip: <Chip icon={<Face />} label='Alice' color='secondary' size='small' />,
            title: 'Generate Re-Encrypt Key',
            content: <IToO
                left={
                    <>
                        <Highlighter language='json'>{
                            formatJSON(Object.fromEntries(Object.entries(dataKey).filter(([tag]) => checked[tag])))
                        }</Highlighter>
                        {userDataStore.tags.map((tag) => (
                            <FormControlLabel
                                control={<Checkbox checked={!!checked[tag]} onChange={handleCheck} name={tag} />}
                                label={tag}
                                key={tag}
                            />
                        ))}
                    </>
                }
                right={
                    <Highlighter language='json'>{formatJSON(rk)}</Highlighter>
                }
                onClick={handleRkGen}
            />
        },
        {
            chip: <Chip icon={<Face />} label='Proxy' size='small' />,
            title: 'Re-Encrypt',
            content: <IToO
                left={
                    <>
                        <Highlighter language='json'>{formatJSON(encrypted)}</Highlighter>
                        <Highlighter language='json'>{formatJSON(rk)}</Highlighter>
                    </>
                }
                right={
                    <Highlighter language='json'>{formatJSON(reEncrypted)}</Highlighter>
                }
                onClick={handleReEncrypt}
            />
        },
        {
            chip: <Chip icon={<Face />} label='Bob' color='primary' size='small' />,
            title: 'Re-Decrypt',
            content: <IToO
                left={
                    <Highlighter language='json'>{formatJSON(reEncrypted)}</Highlighter>
                }
                right={
                    <Highlighter language='json'>{formatJSON(reDecrypted)}</Highlighter>
                }
                onClick={handleReDecrypt}
            />
        }
    ];

    return (
        <Card>
            <Stepper steps={steps} checkDisabled={checkDisabled} />
        </Card>
    );
});
