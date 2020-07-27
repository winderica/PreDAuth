import { Card } from '@material-ui/core';
import { Description, DescriptionOutlined, DescriptionTwoTone, VpnKey, VpnKeyOutlined, VpnKeyTwoTone } from '@material-ui/icons';
import { Redirect, RouteComponentProps } from '@reach/router';
import { observer } from 'mobx-react';
import React, { ChangeEvent, FC, useEffect, useState } from 'react';

import { AdornedTextField } from '../components/AdornedTextField';
import { Checkbox } from '../components/Checkbox';
import { ChipWithFace } from '../components/ChipWithFace';
import { Highlighter } from '../components/Highlighter';
import { IToO } from '../components/IToO';
import { Stepper } from '../components/Stepper';
import { Tooltip } from '../components/Tooltip';
import { Checked, TaggedEncrypted, TaggedPreKeyPair, TaggedReEncrypted, TaggedReKey, TaggedUserData } from '../constants/types';
import { useAlice } from '../hooks/useAlice';
import { useStores } from '../hooks/useStores';
import { useUserData } from '../hooks/useUserData';
import { encrypt, getDataKey, reDecrypt } from '../utils/aliceBobWrapper';
import { Bob } from '../utils/bob';

const formatJSON = (object: unknown, indent = 2) => JSON.stringify(object, null, ' '.repeat(indent));

export const Debug = observer<FC<RouteComponentProps>>(() => {
    const { identityStore, userDataStore } = useStores();
    const alice = useAlice();
    useUserData();
    const [bob] = useState(new Bob(alice.pre, alice.g, alice.h));
    const [encrypted, setEncrypted] = useState<TaggedEncrypted>({});
    const [dataKey, setDataKey] = useState<TaggedPreKeyPair>({});
    const [checked, setChecked] = useState<Checked>({});
    const [reKey, setReKey] = useState<TaggedReKey>({});
    const [reEncrypted, setReEncrypted] = useState<TaggedReEncrypted>({});
    const [reDecrypted, setReDecrypted] = useState<TaggedUserData>({});
    useEffect(() => {
        setDataKey(getDataKey(alice, userDataStore.tags));
    }, [userDataStore.tags]);
    if (!identityStore.id) {
        return <Redirect to='/' noThrow />;
    }

    const handleCheck = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = event.target;
        setChecked((prevChecked) => ({ ...prevChecked, [name]: checked }));
    };
    const handleEncrypt = async () => {
        const { encrypted } = await encrypt(alice, userDataStore.dataArrayGroupedByTag, dataKey);
        setEncrypted(encrypted);
    };
    const handleRkGen = () => {
        setReKey(Object.fromEntries(
            userDataStore.tags
                .filter((tag) => checked[tag])
                .map((tag) => [tag, alice.reKey(bob.key.pk, dataKey[tag].sk)])
        ));
    };
    const handleReEncrypt = () => {
        setReEncrypted(Object.fromEntries(Object.entries(reKey).map(([tag, rk]) => {
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
                return !Object.keys(encrypted).length;
            case 1:
                return !Object.keys(reKey).length;
            case 2:
                return !Object.keys(reEncrypted).length;
            default:
                return false;
        }
    };

    const Data = (
        <Tooltip title={<Highlighter language='json'>{formatJSON(userDataStore.dataGroupedByTag)}</Highlighter>}>
            <AdornedTextField label='Data' value={JSON.stringify(userDataStore.dataGroupedByTag)}>
                <DescriptionOutlined color='secondary' />
            </AdornedTextField>
        </Tooltip>
    );
    const Encrypted = (
        <Tooltip title={<Highlighter language='json'>{formatJSON(encrypted)}</Highlighter>}>
            <AdornedTextField label='Encrypted data' value={JSON.stringify(encrypted)}>
                <Description color='secondary' />
            </AdornedTextField>
        </Tooltip>
    );
    const ReEncrypted = (
        <Tooltip title={<Highlighter language='json'>{formatJSON(reEncrypted)}</Highlighter>}>
            <AdornedTextField label='Re-encrypted data' value={JSON.stringify(reEncrypted)}>
                <DescriptionTwoTone />
            </AdornedTextField>
        </Tooltip>
    );
    const ReDecrypted = (
        <Tooltip title={<Highlighter language='json'>{formatJSON(reDecrypted)}</Highlighter>}>
            <AdornedTextField label='Re-decrypted data' value={JSON.stringify(reDecrypted)}>
                <DescriptionOutlined color='primary' />
            </AdornedTextField>
        </Tooltip>
    );
    const AlicePK = (
        Object.entries(dataKey).map(([tag, { pk }]) => (
            <AdornedTextField key={tag} label={`Public key of Alice's ${tag}`} value={pk}>
                <VpnKey color='secondary' />
            </AdornedTextField>
        ))
    );
    const AliceSK = (
        Object.entries(dataKey).map(([tag, { sk }]) => (
            <AdornedTextField key={tag} label={`Private key of Alice's ${tag}`} value={sk}>
                <VpnKeyOutlined color='secondary' />
            </AdornedTextField>
        ))
    );
    const AlickSKFiltered = AliceSK.filter(({ key }) => key !== null && !!checked[key]);
    const BobPK = (
        <AdornedTextField label='Public key of Bob' value={bob.key.pk}>
            <VpnKey color='primary' />
        </AdornedTextField>
    );
    const BobSK = (
        <AdornedTextField label='Private key of Bob' value={bob.key.sk}>
            <VpnKeyOutlined color='primary' />
        </AdornedTextField>
    );
    const ReKey = (
        Object.entries(reKey).map(([tag, rk]) => (
            <AdornedTextField key={tag} label={`Re-encryption key of ${tag}`} value={rk}>
                <VpnKeyTwoTone />
            </AdornedTextField>
        ))
    );
    const Checkboxes = (
        userDataStore.tags.map((tag) => (
            <Checkbox checked={!!checked[tag]} onCheck={handleCheck} name={tag} key={tag} />
        ))
    );

    const steps = [
        {
            chip: <ChipWithFace label='Alice' color='secondary' />,
            title: 'Encrypt',
            content: <IToO left={<>{AlicePK}{Data}</>} right={Encrypted} onClick={handleEncrypt} />
        },
        {
            chip: <ChipWithFace label='Alice' color='secondary' />,
            title: 'Generate Re-Encrypt Key',
            content: <IToO left={<>{BobPK}{AlickSKFiltered}{Checkboxes}</>} right={ReKey} onClick={handleRkGen} />
        },
        {
            chip: <ChipWithFace label='Proxy' />,
            title: 'Re-Encrypt',
            content: <IToO left={<>{ReKey}{Encrypted}</>} right={ReEncrypted} onClick={handleReEncrypt} />
        },
        {
            chip: <ChipWithFace label='Bob' color='primary' />,
            title: 'Re-Decrypt',
            content: <IToO left={<>{BobSK}{ReEncrypted}</>} right={ReDecrypted} onClick={handleReDecrypt} />
        }
    ];

    return (
        <Card>
            <Stepper steps={steps} checkDisabled={checkDisabled} />
        </Card>
    );
});
