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
    enqueue = (message, variant) => {
        this.enqueueSnackbar({
            message,
            options: {
                variant,
            },
        });
    };

    @action
    enqueueError = (message) => {
        this.enqueue(message, 'error');
    };

    @action
    enqueueWarning = (message) => {
        this.enqueue(message, 'warning');
    };

    @action
    enqueueInfo = (message) => {
        this.enqueue(message, 'info');
    };

    @action
    enqueueSuccess = (message) => {
        this.enqueue(message, 'success');
    };

    @action
    removeSnackbar = (key) => {
        this.notifications = this.notifications.filter(notification => notification.key !== key);
    };
}
