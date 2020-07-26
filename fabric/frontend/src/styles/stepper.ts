import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(({ spacing }) => ({
    title: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    chip: {
        marginRight: spacing(1)
    },
}));
