import { makeStyles } from '@material-ui/core/styles';
import { primary } from './global';

export const useStyles = makeStyles(({ spacing }) => ({
    root: {
        height: '100%',
        background: primary[50],
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        display: 'flex',
    },
    avatar: {
        width: spacing(10),
        height: spacing(10)
    },
    profile: {
        marginLeft: spacing(2),
        minWidth: spacing(40)
    },
    buttonContainer: {
        padding: spacing(2),
        '& :first-child': {
            marginLeft: 'auto'
        }
    }
}));
