import React from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import CircleIcon from '@material-ui/icons/FiberManualRecord';
import Avatar from '@material-ui/core/Avatar';
import { Link } from 'react-router-dom';
import { Box } from '@material-ui/core';
import { CommentCollection, CommentDocument } from '/imports/api/comments';
import { withTracker } from 'meteor/react-meteor-data';
import ChatMessage from './ChatMessage';

const UnreadIcon = () => <CircleIcon style={{color: 'orange', fontSize: '1.2em'}} />

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            '& ul': {
                paddingLeft: theme.spacing(4),
            }
        },
        item: {

        },
        text: {
            flexGrow: 0,
            marginTop: theme.spacing(1),
        },
        bubble: {
            backgroundColor: 'rgb(180, 228, 239)',
            borderRadius: theme.spacing(2),
            padding: theme.spacing(1, 2),
        },
        footer: {
            display: 'flex',
            color: 'rgba(0,0,0,0.4)',
            fontSize: '0.8em',
            padding: theme.spacing(0, 2),
            '& a': {
                textDecoration: 'none',
                color: theme.palette.text.secondary,
            }
        },
        nested: {

        },
    }),
)

type Props = {
    comments: CommentDocument[],
    textId: string,
}

const Chat: React.FC<Props> = ({comments}) => {
    const classes = useStyles();

    return (
        <List className={classes.root} dense={true}>
            {comments.map(comment => <ChatMessage key={comment._id} comment={comment} />)}
        </List>
    )
}

export default withTracker(({textId}: {textId: string}) => {
    return {
        comments: CommentCollection.find({textId}, { sort: { createdAt: 1 } }).fetch(),
    }
})(Chat);