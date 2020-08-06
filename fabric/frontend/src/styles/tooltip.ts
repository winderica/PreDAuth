import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(({ palette, shadows }) => ({
    tooltip: {
        background: palette.background.default,
        boxShadow: shadows[5],
        maxWidth: '80vw'
    },
}));
