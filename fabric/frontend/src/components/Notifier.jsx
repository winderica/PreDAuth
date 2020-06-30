import { useEffect, useState } from 'react';
import { useStores } from '../hooks/useStores';
import { useSnackbar } from 'notistack';
import { autorun } from 'mobx';

export const Notifier = () => {
    const [displayed, setDisplayed] = useState([]);
    const { notificationStore } = useStores();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    useEffect(() => {
        autorun(() => {
            const { notifications } = notificationStore;
            notifications.forEach((notification) => {
                if (displayed.includes(notification.key)) return;
                enqueueSnackbar(notification.message, notification.options);
                setDisplayed((displayed) => [...displayed, notification.key]);
                notificationStore.removeSnackbar(notification.key);
                closeSnackbar(notification.key);
            });
        });
    }, []);
    return null;
};
