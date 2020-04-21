import { Box, IconButton, Typography, Badge } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Variant } from '@material-ui/core/styles/createTypography';
import CheckmarkIcon from '@material-ui/icons/CheckCircle';
import CloseIcon from '@material-ui/icons/Close';
import SearchIcon from '@material-ui/icons/SearchOutlined';
import WarningIcon from '@material-ui/icons/WarningOutlined';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import React from 'react';
import { Link as RouterLink, Link } from 'react-router-dom';
import Diff from './Diff';
import { ParagraphCommitDocument } from '/imports/api/commits';
import { Format, ParagraphDocument } from '/imports/api/paragraphs';
import { TextCollection, TextDocument } from '/imports/api/texts';
import RestoreIcon from '@material-ui/icons/Restore';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            // padding: theme.spacing(1, 1, 1, 3),
            // borderRadius: theme.spacing(3),
            // border: '2px solid #f1f1f1',
            // marginRight: theme.spacing(3),
            // '&:hover': {
            //     border: '2px solid #e1e1e1',

            //     '& > *': {
            //         opacity: 1,
            //     },
            // },
        },
        selected: {
            // borderColor: '#fafafa !important',
            // backgroundColor: '#fafafa',
            marginRight: 0,
            paddingRight: theme.spacing(4),
            borderRadius: theme.spacing(3, 0, 0, 3),
            '& > *': {
                opacity: '1 !important',
            },
        },
        labels: {
            opacity: 0.5,
            '&:hover': {
                opacity: 0.9,
            },
            '& > *': {
                margin: theme.spacing(0.5),
            },
        },
        footer: {
            marginTop: theme.spacing(2),
            alignItems: 'center',
            opacity: 0.5,
            '&:hover': {
                opacity: 0.9,
            },
        },
        avatar: {
            width: theme.spacing(4),
            height: theme.spacing(4),
            marginRight: theme.spacing(1),
        },
        muted: {
            opacity: 0.6,
            textAlign: 'center',
            fontStyle: 'italic',
        },
        container: {
            display: 'flex',
        },
        icon: {
            width: theme.spacing(6),
            textAlign: 'center',
            flexShrink: 0,
        },
        main: {
            flexGrow: 1,
        },
    }),
)

export enum PARAGRAPH_STATE { unread, read };

type Props = {
    documentId: string
    selected: boolean
    text: TextDocument | undefined
    paragraph: ParagraphDocument
    commit: ParagraphCommitDocument | undefined
    numberOfTexts: number
}

const Paragraph: React.FC<Props> = (props) => {
    const classes = useStyles();
    const { documentId, selected, text, paragraph, commit } = props;

    const variant: Variant = paragraph.format === Format.Text || (paragraph.format as string) === 'normal' ? 'body1' : paragraph.format;
    const state: PARAGRAPH_STATE = (commit?.content !== text?.content || (paragraph.deleted && text?.content)) ? PARAGRAPH_STATE.unread : PARAGRAPH_STATE.read;

    const restoreParagraph = () => {
        Meteor.call('paragraphs.restore', paragraph._id);
    }

    if (paragraph.deleted && !commit?.content) {
        return <p className={classes.muted}>paragraph was deleted <IconButton size="small" onClick={restoreParagraph}><RestoreIcon/></IconButton></p>;
    }

    const commitParagraph = () => {
        if (!text || state === PARAGRAPH_STATE.read) {
            return;
        }

        Meteor.call('commits.paragraph', {
            paragraphId: paragraph._id,
            content: paragraph.deleted ? '' : text.content,
        });

        Meteor.call('commits.text', {
            textId: text._id,
            content: text.content,
        });
    }

    return (
        <Box component="section" className={classes.root}>
            <div className={classes.container}>
                <div className={classes.icon}>
                    {state === PARAGRAPH_STATE.read ?
                        <CheckmarkIcon style={{ color: 'green' }} /> :
                        <IconButton onClick={commitParagraph}>
                            <WarningIcon style={{ color: 'red' }} />
                        </IconButton>}
                </div>
                <div className={classes.main}>
                    {paragraph.selectedId ?
                        (text ? <Diff variant={variant} old={commit?.content || ''} current={paragraph.deleted ? '' : text.content} /> : <Typography>Loading text</Typography>) :
                        <Typography>No text selected</Typography>}
                </div>
                {!paragraph.deleted && <div className={classes.icon}>
                    <IconButton component={RouterLink} to={selected ? `/document/${documentId}` : `/document/${documentId}/${paragraph._id}`}>
                        {selected ? <CloseIcon /> :
                        <Badge badgeContent={props.numberOfTexts - 1}><SearchIcon /></Badge>}
                    </IconButton>
                </div>}
            </div>
        </Box>
    )
}

export default withTracker((props: {
    paragraph: ParagraphDocument,
    commit: ParagraphCommitDocument,
    selected: boolean,
    documentId: string,
    index: number,
    setIndex: (index: number) => void
}) => {
    return {
        text: props.paragraph?.selectedId ? TextCollection.findOne(props.paragraph.selectedId) : undefined,
        numberOfTexts: TextCollection.find({paragraphId: props.paragraph._id}).count(),
    }
})(Paragraph);