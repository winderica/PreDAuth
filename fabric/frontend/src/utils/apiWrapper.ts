import { stores } from '../stores';

export const apiWrapper = async (action: () => Promise<void>, info: string, success: string) => {
    const { notificationStore, componentStateStore } = stores;
    try {
        notificationStore.enqueueInfo(info);
        componentStateStore.setProgress(true);
        await action();
        notificationStore.enqueueSuccess(success);
    } catch ({ message }) {
        notificationStore.enqueueError(message);
    } finally {
        componentStateStore.setProgress(false);
    }
};
