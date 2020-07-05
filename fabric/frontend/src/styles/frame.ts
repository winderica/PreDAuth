import { makeStyles } from '@material-ui/core';
import { createStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(({ spacing, breakpoints }) => createStyles({
    root: {
        display: 'flex',
        height: '100vh',
    },
    content: {
        flexGrow: 1,
        marginTop: spacing(8),
        overflowX: 'auto',
        [breakpoints.down('xs')]: {
            marginTop: spacing(6),
        },
        padding: spacing(2)
    },
}));
