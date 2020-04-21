import React, { useState } from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { Box, Chip, IconButton, Grid, Avatar, Typography, Badge, Button } from '@material-ui/core';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import EditIcon from '@material-ui/icons/EditOutlined';
import AddIcon from '@material-ui/icons/NoteAddOutlined';
import CheckmarkIcon from '@material-ui/icons/CheckCircle'
import WarningIcon from '@material-ui/icons/WarningOutlined';
import Chat from './Chat';
import { Link as RouterLink, useRouteMatch, Redirect } from 'react-router-dom'
import { TextDocument } from '/imports/api/texts';
import UserLabel from './UserLabel';
import { Meteor } from 'meteor/meteor';
import DeleteIcon from '@material-ui/icons/DeleteForever';
import { withTracker } from 'meteor/react-meteor-data';
import { CommitCollection, TextCommitDocument, ParagraphCommitDocument } from '/imports/api/commits';
import ChatNew from './ChatNew';
import Moment from 'react-moment';
import { Reaction, ReactionCollection, ReactionDocument } from '/imports/api/reactions';
import clx from 'classnames';
import Tags from './Tags';


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            padding: theme.spacing(1, 3),
            margin: theme.spacing(3, 0, 3, 3),
            borderRadius: theme.spacing(3),
            border: '2px dashed #e1e1e1',
        },
        header: {
            marginBottom: theme.spacing(6),
            alignItems: 'center',
            // opacity: 0.5,
            '& > *': {
                margin: theme.spacing(0.5),
            },
        },
        body: {
            padding: theme.spacing(2, 3),
            backgroundColor: '#fff',
            borderRadius: theme.spacing(2),
            border: '2px solid #e2e2e2',
        },
        footer: {
            marginTop: theme.spacing(6),
            alignItems: 'center',
            // opacity: 0.5,
            '& > *': {
                marginRight: theme.spacing(1),
            }
        },
        time: {
            fontSize: '0.8rem',
            opacity: 0.6,
        },
        readonly: {
            backgroundColor: '#f1f1f1',
            border: 0,
            borderRadius: 0,
        },
        selected: {

        },
        unselected: {
            opacity: 0.6,
            '&:hover': {
                opacity: 1,
            }
        }
    }),
)

type Props = {
    commit: TextCommitDocument | ParagraphCommitDocument | undefined
    text: TextDocument
    numberOfLikes: number
    numberOfDislikes: number
    readonly?: boolean
    reaction: ReactionDocument[]
}

const TextDetail: React.FC<Props> = ({ text, commit, numberOfDislikes, numberOfLikes, readonly = false, reaction }) => {
    const classes = useStyles();
    const matches = useRouteMatch<{ documentId: string }>();

    const [deleted, setDeleted] = useState<boolean>(false);

    const allowEdit = text.ownerId === Meteor.userId() && !readonly;
    const read = commit?.content === text.content;

    const selectTextForParagraph = () => {
        Meteor.call('paragraphs.updateText', text.paragraphId, text._id);
    }

    const deleteParagraph = () => {
        Meteor.call('paragraphs.delete', text.paragraphId, err => {
            if (err) {
                console.warn(err);
            }

            setDeleted(true);
        });
    }

    const commitText = () => {
        if (read) {
            return;
        }

        Meteor.call('commits.text', {
            textId: text._id,
            content: text.content,
        });

        if (readonly) {
            Meteor.call('commits.paragraph', {
                paragraphId: text.paragraphId,
                content: text.content,
            });
        }
    }

    const addReaction = (reaction: Reaction) => {
        Meteor.call('reactions.insert', text._id, reaction);
    }

    if (deleted) {
        return <Redirect to={`/document/${matches.params.documentId}`} />;
    }

    return (
        <Box component="section" className={clx(classes.root, { [classes.readonly]: readonly })}>
            <Grid component="header" container wrap="nowrap" className={classes.header}>
                <UserLabel _id={text.ownerId} />

                <Box flexGrow={1}></Box>

                <Tags documentId={matches.params.documentId} textId={text._id} />
            </Grid>

            <div className={classes.body}>
                <Typography>{text.content}</Typography>
            </div>

            <Grid component="footer" container wrap="nowrap" className={classes.footer}>
                {readonly && <Button onClick={deleteParagraph} startIcon={<DeleteIcon style={{ color: 'red' }} />}>Delete</Button>}
                {!readonly && <Button onClick={selectTextForParagraph}>Select</Button>}

                {/* <Button endIcon={<ExpandMoreIcon/>}>Watch</Button> */}

                <Box flexGrow={1}></Box>

                <Typography className={classes.time}>
                    <Moment fromNow withTitle>{text.createdAt}</Moment>
                </Typography>

                {(!allowEdit || readonly) && (read ?
                    <CheckmarkIcon style={{ color: 'green' }} /> :
                    <IconButton onClick={commitText}>
                        <WarningIcon style={{ color: 'red' }} />
                    </IconButton>)}

                <IconButton onClick={() => addReaction(Reaction.Dislike)} className={reaction.length === 0 || reaction[0].reaction !== Reaction.Dislike ? classes.unselected : classes.selected}>
                    <Badge badgeContent={numberOfDislikes} color="secondary">
                        <ThumbDownIcon />
                    </Badge>
                </IconButton>
                <IconButton onClick={() => addReaction(Reaction.Like)} className={reaction.length === 0 || reaction[0].reaction !== Reaction.Like ? classes.unselected : classes.selected}>
                    <Badge badgeContent={numberOfLikes} color="secondary">
                        <ThumbUpIcon />
                    </Badge>
                </IconButton>
                {allowEdit ? <IconButton component={RouterLink} to={`${matches.url}/edit/${text._id}`}>
                    <EditIcon />
                </IconButton> :
                    <IconButton component={RouterLink} to={`${matches.url}/new/${text._id}`}>
                        <AddIcon />
                    </IconButton>}
            </Grid>

            <Chat textId={text._id} />

            <ChatNew textId={text._id} />
        </Box>
    )
}

export default withTracker((props: { text: TextDocument, readonly?: boolean }) => {
    return {
        commit: CommitCollection.findOne({
            userId: Meteor.userId() as string,
            textId: props.text._id,
        }),
        numberOfLikes: ReactionCollection.find({
            textId: props.text._id,
            reaction: Reaction.Like,
        }).count(),
        numberOfDislikes: ReactionCollection.find({
            textId: props.text._id,
            reaction: Reaction.Dislike,
        }).count(),
        reaction: ReactionCollection.find({
            textId: props.text._id,
            userId: Meteor.userId() as string,
        }).fetch(),
    }
})(TextDetail);