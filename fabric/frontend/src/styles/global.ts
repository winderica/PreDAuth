import { createMuiTheme } from '@material-ui/core';
import { pink, blue } from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/core/styles';

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
    },
}));

export const theme = createMuiTheme({
    palette: {
        primary: blue,
        secondary: pink,
    }
});
