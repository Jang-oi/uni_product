import {Fragment, useState} from "react";

import {styled} from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';

import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import {Collapse, List, ListItemButton, ListItemText} from "@mui/material";
import {ExpandLess, ExpandMore} from "@mui/icons-material";
import {useNavigate} from "react-router-dom";

// LeftMenuWidth 값
const drawerWidth = 300;

const Main = styled('main', {shouldForwardProp: (prop) => prop !== 'open'})(
    ({theme, open}) => ({
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
})(({theme, open}) => ({
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

const DrawerHeader = styled('div')(({theme}) => ({
    display   : 'flex',
    alignItems: 'center',
    padding   : theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
}));

const Menubar = () => {

    const fetchData = {
        menu1     : [
            {menuName: '달력', component: 'Calendar', nodeKey: 1},
            {menuName: '리얼그리드', component: 'RealGrid', nodeKey: 2},
        ],
        menu2     : [
            {menuName: '생성', component: 'RealGridCreate', nodeKey: 2},
            {menuName: '조회', component: 'RealGridRead', nodeKey: 2}
        ],
    }

    const navigate = useNavigate();
    const {menu1, menu2} = fetchData;

    const [open, setOpen] = useState(false);
    const handleDrawerOpen = () => {
        setOpen(true);
    };
    const handleDrawerClose = () => {
        setOpen(false);
    };

    const [menuOpen, setMenuOpen] = useState({
        nodeKey1: false,
        nodeKey2: false,
    });

    const onMenu1Handler = (menu1Value) => {
        const {nodeKey, component} = menu1Value;
        const isMenu2 = menu2.some(data => {
            return data.nodeKey === nodeKey
        });

        if (isMenu2) {
            const key = `nodeKey${nodeKey}`;
            const isOpen = menuOpen[`nodeKey${nodeKey}`];

            setMenuOpen({
                ...menuOpen,
                [key]: !isOpen
            });
        } else {
            navigate(`/${component}`);
        }
    };

    const onMenu2Handler = (menu2Value) => {
        navigate(`/${menu2Value.component}`);
    }


    /**
     * 메뉴 리스트 하위레벨 보이는경우
     * @param nodeKey
     * @returns {JSX.Element}
     */
    const handleExpandDisabled = (nodeKey) => {

        const isMenu2 = menu2.some(data => {
            return data.nodeKey === nodeKey
        });

        const isOpen = menuOpen[`nodeKey${nodeKey}`];
        if (isMenu2) {
            return (
                <Fragment>
                    {!isOpen ? <ExpandLess/> : <ExpandMore/>}
                </Fragment>
            )
        }
    }

    return (
        <Box sx={{display: 'flex'}}>
            <CssBaseline/>
            <AppBar position="fixed" open={open}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="end"
                        onClick={handleDrawerOpen}
                        sx={{...(open && {display: 'none'})}}
                    >
                        <MenuIcon/>
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Main open={open}>
                <DrawerHeader/>
            </Main>
            <Drawer
                sx={{
                    width               : drawerWidth,
                    flexShrink          : 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                    },
                }}
                variant="persistent"
                anchor="left"
                open={open}
            >
                <DrawerHeader>
                    <IconButton onClick={handleDrawerClose}>
                        <ChevronLeftIcon/>
                    </IconButton>
                </DrawerHeader>
                <Divider/>
                <List
                    sx={{width: '100%', maxWidth: 360, bgcolor: 'background.paper'}}
                    component="nav"
                >
                    {menu1.map((value, index) => {
                        return (
                            <Fragment key={index}>
                                <ListItemButton onClick={() => {
                                    onMenu1Handler(value)
                                }}>
                                    <ListItemText primary={value.menuName}/>
                                    {handleExpandDisabled(value.nodeKey)}
                                </ListItemButton>
                            </Fragment>
                        );
                    })}
                    {menu2.map((value, index) => {
                        const isOpen = menuOpen[`nodeKey${value.nodeKey}`];

                        return (
                            <Fragment key={index}>
                                <Collapse in={isOpen} timeout="auto" unmountOnExit>
                                    <List component="div" disablePadding>
                                        <ListItemButton sx={{pl: 4}} onClick={() => {onMenu2Handler(value)}}>
                                            <ListItemText primary={value.menuName}/>
                                        </ListItemButton>
                                    </List>
                                </Collapse>
                            </Fragment>
                        )
                    })}
                </List>
                <Divider/>
            </Drawer>
        </Box>
    );
}
export default Menubar;