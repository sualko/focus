import { Box, Button, Grid, TextField } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import CancelIcon from '@material-ui/icons/Cancel';
import DeleteIcon from '@material-ui/icons/DeleteForever';
import SaveIcon from '@material-ui/icons/Save';
import React, { useState, FormEvent, useEffect } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { TextCollection, TextDocument } from '/imports/api/texts';
import { useRouteMatch, Router, RouteComponentProps, Redirect } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { CommentType } from '/imports/api/comments';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            padding: theme.spacing(3),
            margin: theme.spacing(3, 0, 3, 3),
            borderRadius: theme.spacing(3),
            border: '2px solid #e1e1e1',
        },
        toolbar: {
            '&> *': {
                margin: theme.spacing(0, 1),
            }
        },
        input: {
            marginBottom: theme.spacing(2),
        },
    }),
)

type FormProps = {
    currentContent: string
    submit: (content: string, comment: string) => void
    cancel: () => void
}

const Form: React.FC<FormProps> = ({currentContent, submit, cancel}) => {
    const classes = useStyles();

    const [content, setContent] = useState<string>(currentContent);
    const [comment, setComment] = useState<string>('');

    return (
        <form onSubmit={(ev: FormEvent) => {
            ev.preventDefault();

            submit(content, comment);
        }}>
            <TextField
                value={content}
                onChange={ev => setContent(ev.target.value)}
                label="Edit text"
                required
                multiline
                rows={4}
                variant="outlined"
                fullWidth
                className={classes.input}>
            </TextField>

            <TextField value={comment} onChange={ev => setComment(ev.target.value)} label="Comment" required variant="outlined" fullWidth className={classes.input}></TextField>

            <Grid container wrap="nowrap" className={classes.toolbar}>
                <Button type="submit" variant="contained" color="primary" startIcon={<SaveIcon />}>Save</Button>

                <Box flexGrow={1}></Box>

                <Button startIcon={<DeleteIcon style={{ color: 'red' }} />}>Delete</Button>
                <Button onClick={cancel} variant="contained" color="secondary" startIcon={<CancelIcon />}>Cancel</Button>
            </Grid>
        </form>
    )
}

type Props = {
    text: TextDocument | undefined
    baseUrl: string
}

const TextEdit: React.FC<Props> = ({ text, baseUrl }) => {
    const classes = useStyles();

    const [done, setDone] = useState<boolean>(false);

    if (!text) {
        return <></>;
    }

    const submit = (content: string, comment: string) => {
        console.log('submit update text', content, comment);

        Meteor.call('texts.update', text._id, { content }, (err) => {
            if (err) {
                console.warn(err);
            }

            Meteor.call('comments.insert', {
                textId: text._id,
                content: comment,
                type: CommentType.System,
                oldText: text.content,
                newText: content,
            }, (err, data) => {
                if (err) {
                    console.warn(err);
                }
                console.log('comment.insert result', data)
                setDone(true);
            });
        });
    }

    if (done) {
        return <Redirect to={baseUrl} />;
    }

    return (
        <Box component="section" className={classes.root}>
            <Form currentContent={text.content} submit={submit} cancel={() => setDone(true)} />
        </Box>
    )
}

export default withTracker((props: { baseUrl: string, match: RouteComponentProps["match"] }) => {
    // const match = useRouteMatch<{textId: string}>();

    return {
        ...props,
        text: TextCollection.findOne(props.match.params.textId), //@REVIEW can be any text segment (must not be related to current document)
    }
})(TextEdit);