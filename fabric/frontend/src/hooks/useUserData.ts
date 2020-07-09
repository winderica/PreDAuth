import { useEffect } from 'react';

import { useAlice } from './useAlice';
import { useStores } from './useStores';
import { api } from '../api';
import { apiWrapper } from '../utils/apiWrapper';
import { decrypt } from '../utils/aliceWrapper';

export const useUserData = () => {
    const alice = useAlice();
    const { identityStore, keyStore, userDataStore } = useStores();
    useEffect(() => {
        if (!userDataStore.initialized) {
            void apiWrapper(async () => {
                const data = await api.getData(identityStore.id);
                const decrypted = await decrypt(alice, data, keyStore.dataKey);
                userDataStore.setAll(Object.fromEntries(decrypted.map(({ key, tag, value }) => [key, { tag, value }])));
                userDataStore.setInitialized();
            }, '正在获取数据', '成功获取数据');
        }
    }, []);
};
