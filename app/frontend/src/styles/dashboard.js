import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(({ spacing, palette, transitions }) => ({
    root: {
        height: '100%',
        background: palette.primary[50],
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    expand: ({ expanded }) => ({
        transform: `rotate(${expanded ? 180 : 0}deg)`,
        marginLeft: 'auto',
        transition: transitions.create('transform', {
            duration: transitions.duration.shortest,
        }),
    })
}));
