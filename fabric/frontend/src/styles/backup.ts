import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(({ spacing }) => ({
    cardsContainer: {
        display: 'flex',
    },
    card: {
        margin: spacing(1),
        width: spacing(40)
    },
    cardHeader: {
        width: '100%'
    },
    cardSubheader: {
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        whiteSpace: 'nowrap'
    },
    cardContent: {
        display: 'flex',
        overflowX: 'scroll',
        overflowY: 'hidden'
    },
    chipsContainer: {
        margin: spacing(1),
    },
    chip: {
        marginRight: spacing(0.5),
        '&:last-of-type': {
            marginRight: 0
        },
        background: '#fff'
    },
    draggingChip: {
        '& ~ div': {
            transform: 'none !important'
        },
    },
    defaultChip: {
        borderStyle: 'dashed'
    },
    placeholderChip: {
        width: spacing(15),
        height: 0
    },
    hidden: {
        display: 'none'
    },
    button: {
        margin: spacing(1)
    }
}));
