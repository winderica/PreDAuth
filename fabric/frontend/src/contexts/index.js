import { createContext } from 'react';
import { IdentityStore, KeyStore, UserDataStore } from '../stores';

export const StoresContext = createContext({
    userDataStore: new UserDataStore(),
    identityStore: new IdentityStore(),
    keyStore: new KeyStore(),
});

export const AliceContext = createContext(undefined);
