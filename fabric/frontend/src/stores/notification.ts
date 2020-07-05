import { action, observable } from 'mobx';
import { OptionsObject, SnackbarKey, SnackbarMessage, VariantType } from 'notistack';

interface Snackbar {
    key: SnackbarKey;
    message: SnackbarMessage;
    options: OptionsObject;
}

export class NotificationStore {
    @observable
    notifications: Snackbar[] = [];

    @action
    enqueueSnackbar = ({ message, options }: Omit<Snackbar, 'key'>) => {
        this.notifications.push({
            key: Date.now(),
            message,
            options
        });
    };

    @action
    enqueue = (message: SnackbarMessage, variant: VariantType) => {
        this.enqueueSnackbar({
            message,
            options: {
                variant,
            },
        });
    };

    @action
    enqueueError = (message: SnackbarMessage) => {
        this.enqueue(message, 'error');
    };

    @action
    enqueueWarning = (message: SnackbarMessage) => {
        this.enqueue(message, 'warning');
    };

    @action
    enqueueInfo = (message: SnackbarMessage) => {
        this.enqueue(message, 'info');
    };

    @action
    enqueueSuccess = (message: SnackbarMessage) => {
        this.enqueue(message, 'success');
    };

    @action
    removeSnackbar = (key: SnackbarKey) => {
        this.notifications = this.notifications.filter(notification => notification.key !== key);
    };
}
