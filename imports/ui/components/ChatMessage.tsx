import React from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { ListItem, ListItemIcon, Avatar, ListItemText, Box, Typography } from '@material-ui/core';
import CircleIcon from '@material-ui/icons/FiberManualRecord';
import { Link } from 'react-router-dom';
import UserLabel from './UserLabel';
import Diff from './Diff';
import { CommentDocument } from '/imports/api/comments';
import colorGeneration from 'consistent-color-generation';
import Moment from 'react-moment';
import { Twemoji } from 'react-emoji-render';

const UnreadIcon = () => <CircleIcon style={{color: 'orange', fontSize: '1.2em'}} />

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        item: {

        },
        text: {
            flexGrow: 0,
            marginTop: theme.spacing(1),
            // paddingTop: 3,
        },
        bubble: {
            backgroundColor: 'rgb(180, 228, 239)',
            borderRadius: theme.spacing(2),
            padding: theme.spacing(1, 2),
        },
        content: {
            backgroundColor: 'rgba(255,255,255,0.3)',
            borderRadius: theme.spacing(2),
            padding: theme.spacing(1, 2),
            display: 'inline-block',
            margin: theme.spacing(0, -1, 1, -1),
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
        screenshot: {
            maxWidth: '100%',
        },
    }),
)

type Props = {
    comment: CommentDocument
}

const ChatMessage: React.FC<Props> = ({ comment }) => {
    const classes = useStyles();

    const unread = false;
    const reply = false;
    const bgColor = colorGeneration(comment.userId, undefined, 50, 90);

    console.log('comment', comment)

    return (
        <ListItem className={classes.item} alignItems="flex-start">
            <ListItemIcon>
                <UserLabel avatarOnly={true} _id={comment.userId} />
            </ListItemIcon>
            <ListItemText className={classes.text}>
                {comment.screenshots && Object.keys(comment.screenshots).map(id => {
                    let screenshot = comment.screenshots[id];

                    return <img key={id} className={classes.screenshot} src={`/screenshots/${screenshot}`} alt="Screenshot" />;
                })}
                <div className={classes.bubble} style={{backgroundColor: bgColor.toString()}}>
                    {(comment.oldText || comment.newText) && <div className={classes.content}>
                        <Diff old={comment.oldText || ''} current={comment.newText || ''} />
                    </div>}
                    <Typography><Twemoji svg text={comment.content} /></Typography>
                </div>
                <footer className={classes.footer}>
                    <Moment fromNow>{comment.createdAt}</Moment> {unread && <UnreadIcon />}
                    <Box flexGrow={1}></Box>
                    {reply && <Link to="#">Reply</Link>}
                </footer>
            </ListItemText>
        </ListItem>
    )
}

export default ChatMessage;