import React from 'react';
import FullHeightDrawer, { DrawerWidth } from '../components/FullHeightDrawer';
import { makeStyles, Theme, createStyles } from '@material-ui/core';

export const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            transition: theme.transitions.create(['paddingLeft'], {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
        },
    }),
)

type Props = {
    drawerWidth?: DrawerWidth
}

const SidebarLayout: React.FC<Props> = ({ children, drawerWidth }) => {
    const classes = useStyles();

    return (
        <div className={classes.root} style={{ paddingLeft: drawerWidth }}>
            <FullHeightDrawer width={drawerWidth} />

            {children}
        </div>
    )
}

export default SidebarLayout;