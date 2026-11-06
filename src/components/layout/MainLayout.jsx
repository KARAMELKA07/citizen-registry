
import { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router';

import {
    AppBar,
    Box,
    Divider,
    Drawer,
    IconButton,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Typography,
} from '@mui/material';

import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutlined';

const drawerWidth = 216;

const menuItems = [
    {
        title: 'Обзор',
        path: '/',
        icon: <DashboardOutlinedIcon />,
    },
    {
        title: 'Граждане',
        path: '/citizens',
        icon: <PeopleOutlineIcon />,
    },
];

export default function MainLayout() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const { pathname } = useLocation();

    let pageTitle = 'Обзор';

    if (pathname === '/citizens') {
        pageTitle = 'Картотека граждан';
    } else if (pathname === '/citizens/new') {
        pageTitle = 'Добавление гражданина';
    } else if (pathname.startsWith('/citizens/')) {
        pageTitle = 'Карточка гражданина';
    } else if (pathname !== '/') {
        pageTitle = 'Реестр граждан';
    }

    const drawerContent = (
        <Box
            sx={{
                height: '100%',
                bgcolor: 'background.paper',
                color: 'text.primary',
            }}
        >
            {/* Название приложения */}
            <Toolbar
                sx={{
                    minHeight: '64px !important',
                    px: '20px !important',
                    justifyContent: 'space-between',
                }}
            >
                <Typography
                    variant="subtitle1"
                    fontWeight={700}
                    sx={{ letterSpacing: '-0.3px' }}
                >
                    Реестр граждан
                </Typography>

                <IconButton
                    onClick={() => setMobileOpen(false)}
                    aria-label="Закрыть меню"
                    sx={{
                        display: { xs: 'inline-flex', lg: 'none' },
                        color: 'text.secondary',
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </Toolbar>

            <Divider />

            {/* Основная навигация */}
            <List sx={{ px: 1.5, py: 2 }}>
                {menuItems.map((item) => (
                    <ListItemButton
                        key={item.path}
                        component={NavLink}
                        to={item.path}
                        end={item.path === '/'}
                        onClick={() => setMobileOpen(false)}
                        sx={{
                            minHeight: 44,
                            px: 1.5,
                            mb: 0.5,
                            borderRadius: '10px',
                            color: 'text.secondary',

                            '&:hover': {
                                bgcolor: '#F1F5F9',
                                color: 'text.primary',
                            },

                            '&.active': {
                                bgcolor: '#EFF6FF',
                                color: 'primary.main',
                            },

                            '&.active:hover': {
                                bgcolor: '#DBEAFE',
                            },

                            '&.active .MuiTypography-root': {
                                fontWeight: 600,
                            },

                            '&.Mui-focusVisible': {
                                outline: '2px solid #2563EB',
                                outlineOffset: 2,
                            },
                        }}
                    >
                        <ListItemIcon
                            sx={{
                                minWidth: 36,
                                color: 'inherit',
                            }}
                        >
                            {item.icon}
                        </ListItemIcon>

                        <ListItemText
                            primary={item.title}
                            slotProps={{
                                primary: {
                                    fontSize: 14,
                                    fontWeight: 500,
                                },
                            }}
                        />
                    </ListItemButton>
                ))}
            </List>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            {/* Верхняя панель */}
            <AppBar
                position="fixed"
                sx={{
                    width: { lg: `calc(100% - ${drawerWidth}px)` },
                    ml: { lg: `${drawerWidth}px` },
                    bgcolor: 'background.paper',
                    color: 'text.primary',
                    boxShadow: 'none',
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                }}
            >
                <Toolbar
                    sx={{
                        minHeight: '64px !important',
                        px: { xs: 2, sm: 3 },
                    }}
                >
                    <IconButton
                        edge="start"
                        aria-label="Открыть меню"
                        onClick={() => setMobileOpen(true)}
                        sx={{
                            mr: 2,
                            display: { lg: 'none' },
                            color: 'text.primary',
                        }}
                    >
                        <MenuIcon />
                    </IconButton>

                    <Typography variant="subtitle1" fontWeight={600}>
                        {pageTitle}
                    </Typography>
                </Toolbar>
            </AppBar>

            {/* Боковая панель */}
            <Box
                component="nav"
                aria-label="Основная навигация"
                sx={{
                    width: { lg: drawerWidth },
                    flexShrink: { lg: 0 },
                }}
            >
                {/* Телефоны и планшеты */}
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={() => setMobileOpen(false)}
                    sx={{
                        display: { xs: 'block', lg: 'none' },

                        '& .MuiDrawer-paper': {
                            width: { xs: '100vw', sm: 360 },
                            maxWidth: '100vw',
                            height: '100dvh',
                            border: 0,
                        },
                    }}
                >
                    {drawerContent}
                </Drawer>

                {/* Широкие экраны */}
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', lg: 'block' },

                        '& .MuiDrawer-paper': {
                            width: drawerWidth,
                            boxSizing: 'border-box',
                            borderRight: '1px solid',
                            borderColor: 'divider',
                        },
                    }}
                >
                    {drawerContent}
                </Drawer>
            </Box>

            {/* Содержимое текущей страницы */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    minWidth: 0,
                    p: { xs: 2, sm: 3 },
                }}
            >
                <Toolbar />
                <Outlet />
            </Box>
        </Box>
    );
}
