import { makeStyles } from '@material-ui/core/styles';
import { blueGrey, deepOrange } from '@material-ui/core/colors';
import { createMuiTheme } from '@material-ui/core';

export const useStyles = makeStyles(() => ({
    '@global': {
        '::-webkit-scrollbar': {
            width: 3,
            height: 12,
        },
        '::-webkit-scrollbar-thumb': {
            background: '#aaa',
            borderRadius: 1,
        },
        '*': {
            '-webkit-tap-highlight-color': 'transparent',
        },
        'html, body': {
            margin: 0
        },
    },
}));

export const primary = deepOrange;
export const secondary = blueGrey;

export const theme = createMuiTheme({
    palette: {
        primary,
        secondary,
    }
});
