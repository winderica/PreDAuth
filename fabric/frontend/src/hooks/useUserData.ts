import { useEffect } from 'react';

import { useAlice } from './useAlice';
import { useStores } from './useStores';
import { api } from '../api';

export const useUserData = () => {
    const alice = useAlice();
    const { identityStore, keyStore, userDataStore, notificationStore, componentStateStore } = useStores();
    useEffect(() => {
        void (async () => {
            try {
                notificationStore.enqueueInfo('正在获取数据');
                componentStateStore.setProgress(true);
                const data = await api.getData(identityStore.id);
                await Promise.all(Object.entries(data).map(async ([tag, data]) => {
                    const decrypted: Record<string, string> = JSON.parse(await alice.decrypt(data, keyStore.dataKey[tag].sk));
                    Object.entries(decrypted).forEach(([key, value]) => {
                        userDataStore.set(key, value, tag);
                    });
                }));
                notificationStore.enqueueSuccess('成功获取数据');
            } catch ({ message }) {
                notificationStore.enqueueError(message);
            } finally {
                componentStateStore.setProgress(false);
            }
        })();
    }, []);
};
