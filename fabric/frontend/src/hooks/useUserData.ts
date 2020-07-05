import { useEffect } from 'react';

import { useAlice } from './useAlice';
import { useStores } from './useStores';

export const useUserData = () => {
    const alice = useAlice();
    const { identityStore, keyStore, userDataStore, notificationStore } = useStores();
    useEffect(() => {
        void (async () => {
            if (userDataStore.todo) {
                await userDataStore.fetch(identityStore.id, alice, keyStore.dataKey);
                userDataStore.error && notificationStore.enqueueError(userDataStore.message);
            }
        })();
    }, []);
};
