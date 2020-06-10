import { action, observable } from 'mobx';

export class NotificationStore {
    @observable
    notifications = [];

    @action
    enqueueSnackbar = (note) => {
        this.notifications.push({
            key: Date.now(),
            ...note,
        });
    };

    @action
    removeSnackbar = (key) => {
        this.notifications = this.notifications.filter(notification => notification.key !== key);
    };
}
