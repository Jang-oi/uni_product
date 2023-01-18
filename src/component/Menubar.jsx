import { Fragment, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { serviceCall } from '../utils/callUtil';

import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { Collapse, List, ListItemButton, ListItemText } from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';

// LeftMenuWidth 값
const drawerWidth = 300;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        flexGrow  : 1,
        padding   : theme.spacing(3),
        transition: theme.transitions.create('margin', {
            easing  : theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: `-${drawerWidth}px`,
        ...(open && {
            transition: theme.transitions.create('margin', {
                easing  : theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
            marginLeft: 0,
        }),
    }),
);

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    transition: theme.transitions.create(['margin', 'width'], {
        easing  : theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        width     : `calc(100% - ${drawerWidth}px)`,
        marginLeft: `${drawerWidth}px`,
        transition: theme.transitions.create(['margin', 'width'], {
            easing  : theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
    display   : 'flex',
    alignItems: 'center',
    padding   : theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
}));

const Menubar = () => {
    const navigate = useNavigate();

    const [drawerOpen, setDrawerOpen] = useState(false);
    const [menuData, setMenuData] = useState({});
    const [menuOpen, setMenuOpen] = useState({});

    const handleDrawerOpen = () => {
        setDrawerOpen(true);
    };

    const handleDrawerClose = () => {
        setDrawerOpen(false);
    };

    useEffect(() => {
        const menuOptions = {
            url: '/getMenu',
        };
        serviceCall.post(menuOptions, (returnData) => {
            setMenuData(returnData);
        });
    }, []);


    const { menu1 = [], menu2 = [] } = menuData;
    const onMenu1Handler = (menu1Value) => {
        const { nodeKey, component } = menu1Value;

        if (hasMenu2(nodeKey)) {
            const key = `nodeKey${nodeKey}`;
            const isOpen = menuOpen[`nodeKey${nodeKey}`];

            setMenuOpen({
                ...menuOpen,
                [key]: !isOpen,
            });
        } else {
            navigate(`/${component}`);
        }
    };

    const onMenu2Handler = (menu2Value) => {
        navigate(`/${menu2Value.component}`);
    };

    /**
     * 하위 메뉴가 있는지 체크
     * @param nodeKey
     * @returns {*}
     */
    const hasMenu2 = (nodeKey) => {
        return menu2.some(data => {
            return data.nodeKey === nodeKey;
        });
    };

    /**
     * 메뉴 리스트 하위레벨 보이는경우
     * @param nodeKey
     * @returns {JSX.Element}
     */
    const handleExpandDisabled = (nodeKey) => {
        const isOpen = menuOpen[`nodeKey${nodeKey}`];
        if (hasMenu2(nodeKey)) {
            return (
                <Fragment>
                    {!isOpen ? <ExpandLess /> : <ExpandMore />}
                </Fragment>
            );
        }
    };

    /**
     * 메뉴2 화면 구성
     * @param menu1Value
     * @param menu2Value
     * @param menu2Index
     * @returns {JSX.Element}
     */
    const menu2Disabled = (menu1Value, menu2Value, menu2Index) => {
        if (hasMenu2(menu1Value.nodeKey)) {

            const isOpen = menuOpen[`nodeKey${menu2Value.nodeKey}`];
            return (
                <Fragment key={menu2Index}>
                    <Collapse in={isOpen} timeout='auto' unmountOnExit>
                        <List component='div' disablePadding>
                            <ListItemButton sx={{ pl: 4 }} onClick={() => {
                                onMenu2Handler(menu2Value);
                            }}>
                                <ListItemText primary={menu2Value.menuName} />
                            </ListItemButton>
                        </List>
                    </Collapse>
                </Fragment>
            );
        }
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position='fixed' open={drawerOpen}>
                <Toolbar>
                    <IconButton
                        color='inherit'
                        aria-label='open drawer'
                        edge='end'
                        onClick={handleDrawerOpen}
                        sx={{ ...(drawerOpen && { display: 'none' }) }}
                    >
                        <MenuIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Main open={drawerOpen}>
                <DrawerHeader />
            </Main>
            <Drawer
                sx={{
                    width               : drawerWidth,
                    flexShrink          : 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                    },
                }}
                variant='persistent'
                anchor='left'
                open={drawerOpen}
            >
                <DrawerHeader>
                    <IconButton onClick={handleDrawerClose}>
                        <ChevronLeftIcon />
                    </IconButton>
                </DrawerHeader>
                <Divider />
                <List
                    sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
                    component='nav'
                >
                    {menu1.map((menu1Value, menu1Index) => {
                        return (
                            <Fragment key={menu1Index}>
                                <ListItemButton onClick={() => {
                                    onMenu1Handler(menu1Value);
                                }}>
                                    <ListItemText primary={menu1Value.menuName} />
                                    {handleExpandDisabled(menu1Value.nodeKey)}
                                </ListItemButton>
                                {menu2.map((menu2Value, menu2Index) => {
                                    return (
                                        menu2Disabled(menu1Value, menu2Value, menu2Index)
                                    );
                                })}
                            </Fragment>
                        );
                    })}
                </List>
                <Divider />
            </Drawer>
        </Box>
    );
};

export default Menubar;