import React, { useEffect, useState } from 'react';
import { PRE } from '../utils/pre';
import { Alice } from '../utils/alice';
import { AliceContext } from '../contexts';
import { useStores } from '../hooks/useStores';
import { API } from '../constants';

export const AliceProvider = ({ children }) => {
    const { identityStore } = useStores();
    const [alice, setAlice] = useState(undefined);
    useEffect(() => {
        (async () => {
            const pre = new PRE();
            await pre.init();
            const gh = localStorage.getItem('gh');
            if (!gh) {
                const res = await fetch(API.getGenerators(identityStore.id));
                const { payload: { g, h } } = await res.json();
                localStorage.setItem('gh', [g, h].join('_'));
                const alice = new Alice(pre, g, h);
                setAlice(alice);
            } else {
                const [g, h] = gh.split('_');
                const alice = new Alice(pre, g, h);
                setAlice(alice);
            }
        })();
    }, []);
    return (
        <AliceContext.Provider value={alice}>
            {alice && children}
        </AliceContext.Provider>
    );
};
