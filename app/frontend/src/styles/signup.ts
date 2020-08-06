import { makeStyles } from '@material-ui/core/styles';
import { primary } from './global';

export const useStyles = makeStyles(({ spacing, palette }) => ({
    root: {
        height: '100%',
        background: primary[50],
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    container: {
        display: 'flex',
        alignItems: 'center',
        width: '90%',
        height: '90%',
        background: `linear-gradient(95deg, ${primary[200]} 49%, #ffffff 50%)`,
    },
    header: {
        marginLeft: '10%',
        width: spacing(50),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        color: palette.primary.contrastText,
    },
    logo: {
        width: '90%',
        filter: `drop-shadow(30px 10px 4px ${primary[300]})`
    },
    card: {
        marginLeft: 'auto',
        marginRight: '10%',
    },
    content: {
        height: spacing(50),
        width: spacing(50),
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around'
    }
}));
