import React from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { Drawer, Divider, List, ListItem, ListItemIcon, ListItemText, ListItemAvatar, Box } from '@material-ui/core';
import RoomIcon from '@material-ui/icons/Weekend';
import DocumentIcon from '@material-ui/icons/Description';
import HelpIcon from '@material-ui/icons/Help';
import { withTracker } from 'meteor/react-meteor-data';
import { DocumentCollection, DocumentDocument } from '/imports/api/documents';
import { Link as RouterLink, useRouteMatch } from 'react-router-dom';
import GroupIcon from '@material-ui/icons/Group';
import { Meteor } from 'meteor/meteor';
import Avatar from './Avatar';
import ctx from 'classnames';

export enum DrawerWidth { hidden = 0, minimized = 70, normal = 240 };

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        drawer: {
            flexShrink: 0,
        },
        drawerPaper: {
            transition: theme.transitions.create(['width'], {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
        },
        drawerHidden: {
            width: DrawerWidth.hidden,
            overflow: 'hidden',
        },
        drawerMinimized: {
            width: DrawerWidth.minimized,
            overflow: 'hidden',
        },
        drawerNormal: {
            width: DrawerWidth.normal,
        },
        // necessary for content to be below app bar
        toolbar: theme.mixins.toolbar,
        nested: {
            // paddingLeft: theme.spacing(2),
        },
        noWrap: {
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
        }
    }),
);

type Props = {
    width?: DrawerWidth
    user: Meteor.User
    documents: DocumentDocument[]
}

const FullHeightDrawer: React.FC<Props> = ({ user, documents, width = DrawerWidth.normal }) => {
    const classes = useStyles();
    const match = useRouteMatch<{ documentId: string }>();

    if (!user) {
        return <div></div>;
    }

    return (
        <Drawer
            className={ctx(classes.drawer, {
                [classes.drawerHidden]: width === DrawerWidth.hidden,
                [classes.drawerMinimized]: width === DrawerWidth.minimized,
                [classes.drawerNormal]: width === DrawerWidth.normal,
            })}
            style={{ width }}
            variant="permanent"
            classes={{
                paper: ctx(classes.drawerPaper, {
                    [classes.drawerHidden]: width === DrawerWidth.hidden,
                    [classes.drawerMinimized]: width === DrawerWidth.minimized,
                    [classes.drawerNormal]: width === DrawerWidth.normal,
                }),
            }}
            anchor="left"
            open={true}
        >
            <List>
                <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                        <Avatar user={user} />
                    </ListItemAvatar>
                    <ListItemText className={classes.noWrap} primary={user.profile?.name} secondary="User" />
                </ListItem>
            </List>
            <Divider light={true} />
            <List>
                <ListItem button component={RouterLink} to={`/documents`}>
                    <ListItemIcon><RoomIcon /></ListItemIcon>
                    <ListItemText className={classes.noWrap} primary="Overview" />
                </ListItem>
                <List className={classes.nested}>
                    {documents.map(document => (
                        <ListItem key={document._id} selected={match.params.documentId === document._id} button component={RouterLink} to={`/document/${document._id}`}>
                            <ListItemIcon><DocumentIcon /></ListItemIcon>
                            <ListItemText className={classes.noWrap} primary={document.title} />
                        </ListItem>
                    ))}
                </List>
            </List>

            <Box flexGrow={1}></Box>

            <List>
                <ListItem button component={RouterLink} to={`/users`}>
                    <ListItemIcon><GroupIcon /></ListItemIcon>
                    <ListItemText primary="Users" />
                </ListItem>
                <ListItem button>
                    <ListItemIcon><HelpIcon /></ListItemIcon>
                    <ListItemText primary="Help" />
                </ListItem>
            </List>
        </Drawer>
    );
}

export default withTracker((props: any) => {
    return {
        user: Meteor.user(),
        documents: DocumentCollection.find({}, { sort: { createdAt: -1 } }).fetch(),
    }
})(FullHeightDrawer);