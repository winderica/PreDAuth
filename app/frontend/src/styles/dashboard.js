import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(({ palette, spacing }) => ({
    root: {
        height: '100%',
        background: palette.primary[50],
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
    }
}));
