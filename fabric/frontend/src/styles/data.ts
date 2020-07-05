import { createStyles, makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(({ spacing }) => createStyles({
    container: {
        width: spacing(80)
    },
    button: {
        marginTop: spacing(2)
    }
}));
