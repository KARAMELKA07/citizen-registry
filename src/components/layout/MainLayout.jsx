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
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutlined';

const drawerWidth = 240;
const menuItems = [
    {
        title: 'Главная',
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

    let pageTitle = 'Панель управления';

    if (pathname === '/citizens') {
        pageTitle = 'Картотека граждан';
    } else if (pathname.startsWith('/citizens/')) {
        pageTitle = 'Карточка гражданина';
    } else if (pathname !== '/') {
        pageTitle = 'Citizen Registry';
    }

    const drawerContent = (
        <Box
            sx={{
                height: '100%',
                bgcolor: '#172B4D',
                color: '#FFFFFF',
            }}
        >
            <Toolbar>
                <Typography variant="h6" fontWeight={700}>
                    Citizen Registry
                </Typography>
            </Toolbar>

            <Divider sx={{ borderColor: 'rgba(255,255,255,0.15)' }} />

            <List sx={{ p: 1.5 }}>
                {menuItems.map((item) => (
                    <ListItemButton
                        key={item.path}
                        component={NavLink}
                        to={item.path}
                        end={item.path === '/'}
                        onClick={() => setMobileOpen(false)}
                        sx={{
                            borderRadius: 2,
                            mb: 0.5,
                            color: '#C6D5ED',

                            '&.active': {
                                bgcolor: 'rgba(255,255,255,0.15)',
                                color: '#FFFFFF',
                            },

                            '&:hover': {
                                bgcolor: 'rgba(255,255,255,0.1)',
                            },
                        }}
                    >
                        <ListItemIcon
                            sx={{
                                minWidth: 40,
                                color: 'inherit',
                            }}
                        >
                            {item.icon}
                        </ListItemIcon>

                        <ListItemText primary={item.title} />
                    </ListItemButton>
                ))}
            </List>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            <AppBar
                position="fixed"
                sx={{
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },
                    bgcolor: 'background.paper',
                    color: 'text.primary',
                    boxShadow: 'none',
                    borderBottom: '1px solid #E5EAF1',
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        edge="start"
                        aria-label="Открыть меню"
                        onClick={() => setMobileOpen(true)}
                        sx={{
                            mr: 2,
                            display: { sm: 'none' },
                        }}
                    >
                        <MenuIcon />
                    </IconButton>

                    <Typography variant="h6" fontWeight={600}>
                        {pageTitle}
                    </Typography>
                </Toolbar>
            </AppBar>

            <Box
                component="nav"
                sx={{
                    width: { sm: drawerWidth },
                    flexShrink: { sm: 0 },
                }}
            >
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={() => setMobileOpen(false)}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': {
                            width: drawerWidth,
                            border: 0,
                        },
                    }}
                >
                    {drawerContent}
                </Drawer>

                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': {
                            width: drawerWidth,
                            border: 0,
                        },
                    }}
                >
                    {drawerContent}
                </Drawer>
            </Box>

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    minWidth: 0,
                    p: { xs: 2, md: 3 },
                }}
            >
                <Toolbar />
                <Outlet />
            </Box>
        </Box>
    );
}
