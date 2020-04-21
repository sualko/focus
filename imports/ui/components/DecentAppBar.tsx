import React from 'react';
import { AppBar, Typography, Toolbar, Box, IconButton, Menu, MenuItem, makeStyles, Theme, createStyles, useTheme } from "@material-ui/core";
import useMediaQuery from '@material-ui/core/useMediaQuery';
import AvatarGroup from '@material-ui/lab/AvatarGroup';
import NotificationsIcon from '@material-ui/icons/Notifications';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import Search from './Search';
import Avatar from './Avatar';
import { Meteor } from 'meteor/meteor';
import { DrawerWidth } from './FullHeightDrawer';

export const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {

        },
        toolbar: {
            paddingLeft: theme.spacing(0),
        }
    }),
)

type Props = {
    title: string
    users?: Meteor.User[],
    drawerWidth?: DrawerWidth,
    setDrawerWidth?: (drawerWidth: DrawerWidth) => void,
}

const DecentAppBar: React.FC<Props> = ({ title, users = [], drawerWidth, setDrawerWidth }) => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const classes = useStyles();
    const theme = useTheme();
    const smUp = useMediaQuery(theme.breakpoints.up('sm'));

    const isMenuOpen = Boolean(anchorEl);

    const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        Meteor.logout((err) => {
            if (err) {
                console.warn('Could not logout: ', err);
            } else {
                window.location.href = '/';
            }
        });

        handleMenuClose();
    }

    const menuId = 'primary-search-account-menu';

    return (
        <AppBar position="relative" color="transparent" className={classes.root}>
            <Toolbar className={classes.toolbar}>
                {typeof drawerWidth === 'number' && setDrawerWidth && <IconButton onClick={() => setDrawerWidth(drawerWidth === DrawerWidth.normal ? (smUp ? DrawerWidth.minimized : DrawerWidth.hidden) : DrawerWidth.normal)}>
                    {drawerWidth === DrawerWidth.normal ? <ChevronLeftIcon /> : <MenuIcon />}
                </IconButton>}

                <Typography variant="h6" noWrap>{title}</Typography>

                {users.length > 0 && <AvatarGroup max={3} style={{ transform: 'scale(.6)' }}>
                    {users.map(user => <Avatar key={user._id} user={user} />)}
                </AvatarGroup>}

                <Box flexGrow={1}></Box>

                <Search />

                <IconButton>
                    <NotificationsIcon />
                </IconButton>

                <IconButton
                    edge="end"
                    aria-label="Account of current user"
                    aria-controls={menuId}
                    aria-haspopup="true"
                    onClick={handleProfileMenuOpen}
                    color="inherit"
                >
                    <AccountCircle />
                </IconButton>
            </Toolbar>

            <Menu
                anchorEl={anchorEl}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                id={menuId}
                keepMounted
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                open={isMenuOpen}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={handleLogout }>Logout</MenuItem>
            </Menu>
        </AppBar>
    )
}

export default DecentAppBar;

