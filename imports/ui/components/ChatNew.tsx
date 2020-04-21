import React, { useState, FormEvent } from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { Box, TextField, IconButton, Popover } from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send'
import EmoticonIcon from '@material-ui/icons/SentimentSatisfied';
import { Meteor } from 'meteor/meteor';
import { CommentType } from '/imports/api/comments';
import 'emoji-mart/css/emoji-mart.css'
import { Picker } from 'emoji-mart'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        form: {
            display: 'flex',
            margin: theme.spacing(3, 0, 2, 0),
        },
        input: {
            flexGrow: 1,
            padding: theme.spacing(2, 3),
            borderRadius: theme.spacing(2),
            backgroundColor: '#e6e6e6',
            border: 0,
        },
        emoticon: {

        },
        submit: {
            color: 'green',
        },
    }),
)

type Props = {
    textId: string
}

const ChatNew: React.FC<Props> = ({ textId }) => {
    const classes = useStyles();

    const [content, setContent] = useState<string>('');
    const [processing, setProcessing] = useState<boolean>(false);
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const onSubmit = (ev: FormEvent) => {
        ev.preventDefault();
        setProcessing(true);

        Meteor.call('comments.insert', {
            textId: textId,
            content,
            type: CommentType.User,
        }, (err, data) => {
            if (err) {
                console.warn(err);
            }

            setContent('');
            setProcessing(false);
        });
    }

    const insertEmoticon = (colons: string) => {
        setContent(content + ' ' + colons);

        handleClose();
    }

    return (
        <Box>
            <form className={classes.form} onSubmit={onSubmit}>
                <IconButton className={classes.emoticon} disabled={processing} onClick={handleClick}>
                    <EmoticonIcon />
                </IconButton>

                <input
                    disabled={processing}
                    value={content}
                    onChange={ev => setContent(ev.target.value)}
                    placeholder="New comment"
                    required
                    className={classes.input}>
                </input>

                <IconButton className={classes.submit} disabled={processing || content.length === 0} type="submit">
                    <SendIcon />
                </IconButton>
            </form>

            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}>
                <Picker onSelect={(emoji) => insertEmoticon(emoji.colons)} emoji="" set="twitter" showPreview={false} showSkinTones={false} title="" />
            </Popover>
        </Box>
    )
}

export default ChatNew;