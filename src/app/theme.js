
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        mode: 'light',

        primary: {
            main: '#2563EB',
            dark: '#1D4ED8',
            light: '#EFF6FF',
        },

        background: {
            default: '#F5F7FB',
            paper: '#FFFFFF',
        },

        text: {
            primary: '#0F172A',
            secondary: '#64748B',
        },

        divider: '#E2E8F0',
    },

    typography: {
        fontFamily: '"Roboto", sans-serif',

        button: {
            textTransform: 'none',
            fontWeight: 600,
        },
    },

    shape: {
        borderRadius: 10,
    },

    components: {
        MuiTabs: {
            styleOverrides: {
                indicator: {
                    height: 3,
                    borderRadius: 3,
                },
            },
        },

        MuiTab: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    fontWeight: 500,
                    minHeight: 44,

                    '&:hover': {
                        color: '#2563EB',
                    },

                    '&.Mui-selected': {
                        fontWeight: 600,
                    },
                },
            },
        },
    },
});

export default theme;
