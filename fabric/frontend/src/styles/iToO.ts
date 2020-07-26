import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(() => ({
    container: {
        overflow: 'hidden',
    },
    content: {
        display: 'flex',
        alignItems: 'center',
    },
    part: {
        flexGrow: 1,
        minWidth: 0, // https://stackoverflow.com/a/36150764
    },
}));
