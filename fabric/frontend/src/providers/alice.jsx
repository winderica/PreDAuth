import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import * as idb from 'idb-keyval';

import { PRE } from '../utils/pre';
import { Alice } from '../utils/alice';
import { AliceContext } from '../contexts';
import { API } from '../constants';
import { useStores } from '../hooks/useStores';

export const AliceProvider = observer(({ children }) => {
    const [alice, setAlice] = useState(undefined);
    const { notificationStore } = useStores();
    useEffect(() => {
        (async () => {
            const pre = new PRE();
            await pre.init();
            if (!await idb.get('gh')) {
                const { ok, payload } = await (await fetch(API.getGenerators)).json();
                if (!ok) {
                    notificationStore.enqueueSnackbar({
                        message: payload.message,
                        options: {
                            variant: 'info',
                        },
                    });
                    return;
                }
                await idb.set('gh', payload);
            }
            const { g, h } = await idb.get('gh');
            setAlice(new Alice(pre, g, h));
        })();
    }, []);
    return (
        <AliceContext.Provider value={alice}>
            {alice && children}
        </AliceContext.Provider>
    );
});
