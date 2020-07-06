import { createContext } from 'react';
import { IdentityStore, KeyStore, NotificationStore, UserDataStore, ComponentStateStore } from '../stores';

export const StoresContext = createContext({
    userDataStore: new UserDataStore(),
    identityStore: new IdentityStore(),
    keyStore: new KeyStore(),
    notificationStore: new NotificationStore(),
    componentStateStore: new ComponentStateStore(),
});
