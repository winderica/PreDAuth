import { useEffect, useState } from 'react';
import { SnackbarKey, useSnackbar } from 'notistack';
import { autorun } from 'mobx';
import { useStores } from '../hooks/useStores';

export const Notifier = () => {
    const [displayed, setDisplayed] = useState<SnackbarKey[]>([]);
    const { notificationStore } = useStores();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    useEffect(() => {
        autorun(() => {
            const { notifications } = notificationStore;
            notifications.forEach(({ key, options, message }) => {
                if (displayed.includes(key)) return;
                enqueueSnackbar(message, options);
                setDisplayed((displayed) => [...displayed, key]);
                notificationStore.removeSnackbar(key);
                closeSnackbar(key);
            });
        });
    }, []);
    return null;
};
