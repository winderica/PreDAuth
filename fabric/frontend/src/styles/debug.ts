import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(() => ({
    container: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    left: {
        width: '45%',
    },
    right: {
        width: '45%',
    }
}));
