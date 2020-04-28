import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(({ spacing, palette }) => ({
    container: {
        height: '100%',
        background: palette.primary[100],
        backgroundSize: '100% 100%',
        display: 'flex',
        alignItems: 'center',
    },
    header: {
        marginLeft: '15%',
        width: spacing(80),
        '& > *': {
            margin: spacing(1)
        }
    },
    card: {
        marginLeft: 'auto',
        marginRight: '15%',
    },
    content: {
        height: spacing(50),
        width: spacing(50),
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around'
    }
}));
