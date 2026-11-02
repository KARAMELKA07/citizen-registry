import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#3263A9',
        },
        background: {
            default: '#F6F8FC',
            paper: '#FFFFFF',
        },
        text: {
            primary: '#1E293B',
            secondary: '#64748B',
        },
    },
    typography: {
        fontFamily: '"Roboto", sans-serif',
    },

    shape: {
        borderRadius: 10,
    },
});

export default theme;
