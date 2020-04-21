import { Box, Button, Grid, TextField, Typography } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import CancelIcon from '@material-ui/icons/Cancel';
import DeleteIcon from '@material-ui/icons/DeleteForever';
import CopyIcon from '@material-ui/icons/FileCopy';
import SaveIcon from '@material-ui/icons/Save';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import React, { FormEvent, useState } from 'react';
import { Redirect, useRouteMatch } from 'react-router-dom';
import { CommentType, insertComment } from '/imports/api/comments';
import { TextCollection, TextDocument, insertText } from '/imports/api/texts';
import CKEditor from '@ckeditor/ckeditor5-react';
import BalloonEditor from '@ckeditor/ckeditor5-build-balloon';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            padding: theme.spacing(3),
            margin: theme.spacing(3, 0, 3, 3),
            borderRadius: theme.spacing(3),
            border: '2px solid #e1e1e1',
        },
        toolbar: {
            margin: theme.spacing(2, 0),
        },
        input: {
            marginBottom: theme.spacing(2),
        },
        editor: {
            marginBottom: theme.spacing(2),
        }
    }),
)

type Props = {
    baseUrl: string
    baseText: TextDocument | undefined
}

const TextNewComponent: React.FC<Props> = ({ baseUrl, baseText }) => {
    const classes = useStyles();

    const [done, setDone] = useState<boolean>(false);
    const [text, setText] = useState<string>('');
    const [comment, setComment] = useState<string>('');

    const copy = () => {
        if (!text) {
            setText(baseText?.content || '');
        }
    }

    const onSubmit = async (ev: FormEvent) => {
        ev.preventDefault();

        if (!baseText) {
            return;
        }

        const newTextId = await insertText({
            content: text,
            paragraphId: baseText.paragraphId,
        });

        await insertComment({
            textId: newTextId,
            content: comment,
            type: CommentType.System,
            oldText: baseText?.content,
            newText: text,
        });

        setDone(true);
    }

    if (done) {
        return <Redirect to={baseUrl} />;
    }

    return (
        <Box component="section" className={classes.root}>
            <form onSubmit={onSubmit}>
                <Typography>{baseText?.content}</Typography>

                <Grid container wrap="nowrap" className={classes.toolbar}>
                    <Button onClick={copy} startIcon={<CopyIcon />}>Copy</Button>

                    <Box flexGrow={1}></Box>

                    <Button startIcon={<DeleteIcon style={{ color: 'red' }} />}>Delete</Button>
                </Grid>

                <div className={classes.editor}>
                    <CKEditor
                        editor={BalloonEditor}
                        data=""
                        config={{
                            height: '200px',
                            placeholder: 'New text',
                            removePlugins: ['Heading', 'Link'],
                            toolbar: ['bold', 'italic', 'bulletedList', 'numberedList', 'blockQuote'],
                        }}
                        onChange={(event, editor) => {
                            const data = editor.getData();

                            setText(data);
                        }}
                    />
                </div>

                <TextField label="New text" required multiline rows={4} variant="outlined" fullWidth className={classes.input} value={text} onChange={ev => setText(ev.target.value)}></TextField>

                <TextField label="Comment" required variant="outlined" fullWidth className={classes.input} value={comment} onChange={ev => setComment(ev.target.value)}></TextField>

                <Grid container wrap="nowrap">
                    <Button type="submit" variant="contained" color="primary" startIcon={<SaveIcon />}>Save</Button>

                    <Box flexGrow={1}></Box>

                    <Button color="secondary" onClick={() => setDone(true)} startIcon={<CancelIcon />}>Cancel</Button>
                </Grid>
            </form>
        </Box>
    )
}

const TextNew = withTracker((props: { textId: string, baseUrl: string }) => {
    console.log('withTracker', props)
    return {
        ...props,
        baseText: TextCollection.findOne(props.textId), //@REVIEW can be any text segment (must not be related to current document)
    }
})(TextNewComponent);

const TextNewContainer: React.FC<{ baseUrl: string }> = ({ baseUrl }) => {
    const match = useRouteMatch<{ textId: string }>();

    return <TextNew baseUrl={baseUrl} textId={match.params.textId} />;
}

export default TextNewContainer;