import React, { FC, useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import * as idb from 'idb-keyval';

import { PRE } from '../utils/pre';
import { Alice } from '../utils/alice';
import { AliceContext } from '../contexts';
import { useStores } from '../hooks/useStores';
import { api } from '../api';

export const AliceProvider = observer<FC>(({ children }) => {
    const [alice, setAlice] = useState<Alice | undefined>(undefined);
    const { notificationStore } = useStores();
    useEffect(() => {
        void (async () => {
            const pre = new PRE();
            await pre.init();
            const gh = await idb.get<{ g: string; h: string; }>('gh');
            if (!gh) {
                try {
                    const { g, h } = await api.getGenerators();
                    await idb.set('gh', { g, h });
                    setAlice(new Alice(pre, g, h));
                } catch ({ message }) {
                    notificationStore.enqueueError(message);
                }
            } else {
                const { g, h } = gh;
                setAlice(new Alice(pre, g, h));
            }
        })();
    }, []);
    return alice ? (
        <AliceContext.Provider value={alice}>
            {children}
        </AliceContext.Provider>
    ) : <></>;
});
