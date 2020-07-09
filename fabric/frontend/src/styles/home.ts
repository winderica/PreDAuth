import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(({ spacing }) => ({
    container: {
        display: 'flex',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'space-around',
        margin: `0 ${spacing(10)}px`
    },
    logo: {
        width: '40%',
        marginRight: spacing(6)
    },
    header: {
        textTransform: 'uppercase',
        letterSpacing: '0.3rem'
    },
}));
