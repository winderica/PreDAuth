import { UserDataStore } from './userData';
import { IdentityStore } from './identity';
import { KeyStore } from './key';
import { NotificationStore } from './notification';
import { ComponentStateStore } from './componentState';

export const stores = {
    userDataStore: new UserDataStore(),
    identityStore: new IdentityStore(),
    keyStore: new KeyStore(),
    notificationStore: new NotificationStore(),
    componentStateStore: new ComponentStateStore(),
};

export { ComponentStateStore, UserDataStore, IdentityStore, KeyStore, NotificationStore };
