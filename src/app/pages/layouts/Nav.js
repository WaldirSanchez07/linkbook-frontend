import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { makeStyles, IconButton, Tooltip, Chip, Avatar, Button, Paper, MenuList, MenuItem } from '@material-ui/core';
import { MenuOptions, Skeleton } from './HomeElements';
import { AppContext, HomeContext } from '../../_helpers/Context';
import { sortableContainer, sortableElement, sortableHandle } from 'react-sortable-hoc';
import { getSessionStorage, xLogout } from '../../_helpers/Session';
import Logo from '../_images/logo.svg';
import LogoDark from '../_images/logodark.svg';
import { deepPurple } from '@material-ui/core/colors';

const useStyles = makeStyles((theme) => ({
    margin: {
        margin: theme.spacing(1),
    },
    mlAuto: {
        marginLeft: 'auto'
    },
    btnCo: {
        paddingLeft: '24px'
    },
    paper: {
        position: 'absolute',
        zIndex: '1',
        marginTop: '5px',
        right: '0',
        minWidth: '158px'
    },
    menuItem: {
        fontSize: '13px'
    },
    purple: {
        color: theme.palette.getContrastText(deepPurple[500]),
        backgroundColor: deepPurple[500],
    }
}));

export const Sidebar = ({ collection, SortEnd, showbar, onSidebar, loadingCo }) => {
    const classes = useStyles();
    const ctx = useContext(HomeContext);
    const m = getSessionStorage('_m');

    return (
        <>
            <div className="sidebar-container" sidebar={showbar ? 'show' : 'hidde'}>
                <div className="sidebar-logo">
                    <Link to="/">
                        <img src={m ? m === '1' ? LogoDark : Logo : Logo} alt="linkbook" />
                    </Link>
                </div>
                <div className="sidebar-content">
                    <div className="menu">
                        <div className="menu-title">
                            <i className="material-icons">widgets</i>
                            <span>Colecciones</span>
                            <Tooltip title="Ordenar">
                                <IconButton aria-label="options" size="small" className={[classes.mlAuto, 'npl']} onClick={ctx.handleIconSort}>
                                    <i className="material-icons">sort</i>
                                </IconButton>
                            </Tooltip>
                        </div>
                        {
                            loadingCo ? <Skeleton /> :
                                collection && <SortableList items={collection} label='collection' onSortEnd={SortEnd} useDragHandle />
                        }
                        <div className={classes.btnCo}>
                            <Button variant="outlined" size="small" className="btn-outlined"
                                startIcon={<i className="material-icons">dashboard_customize</i>}
                                onClick={ctx.onModalCo}
                            >
                                Nueva colección
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="offSidebar" wrapper={showbar ? 'show' : 'hidde'} onClick={onSidebar}></div>
        </>
    )
}

/** Sort - Collections **/
const DragHandle = sortableHandle(() => {
    const classes = useStyles();
    return (
        <Tooltip title="Mover">
            <IconButton aria-label="drag" size="small" className={classes.mlAuto}>
                <i className="material-icons-round">drag_handle</i>
            </IconButton>
        </Tooltip>
    )
});

const SortableList = sortableContainer(({ items, label }) => {
    return (
        <div className="menuSortTable">
            {
                items.map((item, i) => <SortableItemCo key={i} val={item} label={label} index={i} />)
            }
        </div>
    )
});

const SortableItemCo = sortableElement(({ val, label }) => {
    const ctx = useContext(HomeContext);
    return (
        <div className="menu-list" link-active={ctx.auxObject.idCo === val._id ? '1' : '0'}>
            <div className="list-name-container" onClick={(e) => ctx.getCategory(e, val)}>
                <span className="list-name">{val.name}</span>
            </div>
            {ctx.iconSort && <DragHandle />}
            <MenuOptions objData={val} label={label} />
        </div>
    )
});

const Menu = ({ paper, menuItem, handleActive }) => {
    const ctx = useContext(AppContext);
    const ctxH = useContext(HomeContext);

    const handleAccount = () => {
        ctxH.showProfile();
        handleActive();
    }

    const handleLogout = () => {
        xLogout();
        ctx.handleAuth();
        const body = document.getElementsByTagName("body"); //etq for mode
        body[0].classList.remove("dark");
        window.location.href = "/";
    }

    return (
        <Paper className={paper}>
            <MenuList>
                <MenuItem className={menuItem} onClick={handleAccount}>
                    <i className="material-icons-round">manage_accounts</i>
                    <span className="mr5">Cuenta</span>
                </MenuItem>
                <MenuItem className={menuItem} onClick={handleLogout}>
                    <i className="material-icons-round">logout</i>
                    <span className="mr5">Salir</span>
                </MenuItem>
            </MenuList>
        </Paper>
    )
}

export const Navbar = ({ onSidebar }) => {
    const classes = useStyles();
    const [active, setActive] = React.useState(false);
    const name = getSessionStorage('_n');
    const handleActive = () => {
        setActive(!active);
    }

    return (
        <div className="navbar">
            <div className="navbar-container">
                <div className="navbar-left">
                    <Tooltip title="Menu">
                        <IconButton aria-label="menu" className={[classes.margin, 'btn-sidebar']} onClick={onSidebar}>
                            <i className="material-icons">menu</i>
                        </IconButton>
                    </Tooltip>
                </div>
                <div className="navbar-right">
                    <div className="avatarContent">
                        <Chip label="Waldir Sanchez" className="navbar-avatar" onClick={(e) => handleActive()}
                            avatar={<Avatar className={classes.purple}>{name ? name.charAt() : <i className="material-icons">person</i>}</Avatar>}
                        />
                        {active && <Menu paper={classes.paper} menuItem={classes.menuItem} handleActive={handleActive} />}
                    </div>
                </div>
            </div>
        </div>
    )
}

export const NavbarProfile = () => {
    const m = getSessionStorage('_m');
    return (
        <div className="navbar">
            <div className="navbar-container w1200">
                <div className="navbar-left">
                    <div className="logoContainer">
                        <Link to='/'><img src={m ? m === '1' ? LogoDark : Logo : Logo} alt="linkbook" /></Link>
                    </div>
                </div>
                <div className="navbar-right">
                    <div className="avatarContent">
                    </div>
                </div>
            </div>
        </div>
    )
}