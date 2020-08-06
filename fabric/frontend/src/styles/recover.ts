import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(({ spacing }) => ({
    card: {
        padding: spacing(2),
        '&:not(:first-child)': {
            marginTop: spacing(2)
        }
    },
    button: {
        marginTop: spacing(1)
    }
}));

export default useStyles;
