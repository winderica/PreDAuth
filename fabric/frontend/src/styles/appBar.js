import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(({ zIndex, palette, transitions, spacing, breakpoints }) => ({
    appBar: ({ open }) => ({
        zIndex: zIndex.drawer + 1,
        background: `linear-gradient(60deg, ${palette.primary.main}, ${palette.primary.dark})`,
        transition: transitions.create(['width', 'margin'], {
            easing: transitions.easing.sharp,
            duration: open ? transitions.duration.enteringScreen : transitions.duration.leavingScreen,
        }),
        ...(open ? {
            marginLeft: spacing(3),
            width: `calc(100% - ${spacing(30)}px)`,
        } : {})
    }),
    appBarGutters: {
        paddingRight: 0,
    },
    regular: {
        minHeight: spacing(8),
        [breakpoints.down('xs')]: {
            minHeight: spacing(6),
        },
    },
    menuButton: {
        marginLeft: spacing(2),
        marginRight: spacing(4),
        [breakpoints.down('xs')]: {
            marginLeft: 0,
            marginRight: 0,
            padding: spacing(1)
        },
    },
}));
