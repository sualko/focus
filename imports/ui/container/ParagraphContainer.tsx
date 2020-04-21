import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import React from 'react';
import { useParams } from 'react-router-dom';
import Paragraph from '../components/Paragraph';
import AddIcon from '@material-ui/icons/Add';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import { ParagraphCollection, ParagraphDocument } from '/imports/api/paragraphs';
import { CommitCollection, ParagraphCommitDocument } from '/imports/api/commits';
import { Button, makeStyles, Theme, createStyles } from '@material-ui/core';
import clx from 'classnames';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            margin: theme.spacing(3, 0),
        },
        selected: {
            // borderRadius: theme.spacing(3),
            // border: '2px solid #e1e1e1',
            backgroundColor: '#f1f1f1',
            '& > *': {
                opacity: '1 !important',
            },
        },
        button:{
            margin: theme.spacing(3, 0, 3, 3),
        },
        spinner: {
            marginBottom: theme.spacing(3),
        }
    }),
)

type Props = {
    _id: string
    paragraph: ParagraphDocument | undefined
    commit: ParagraphCommitDocument | undefined
    index: number
    selectedIndex: number
    selectIndex: (index: number) => void
}

const ParagraphContainer: React.FC<Props> = (props) => {
    const classes = useStyles();
    const params = useParams<{ paragraphId: string, documentId: string }>();
    const { index, selectedIndex, selectIndex } = props;
    const selected = params.paragraphId === props._id;

    if (!props.paragraph) {
        return <></>;
    }

    return (
        <div className={clx(classes.root, { [classes.selected]: selected })}>
            {selected && <Button
                className={classes.button}
                color="primary"
                onClick={() => selectIndex(index)}
                startIcon={selectedIndex === index ? <ArrowForwardIcon /> : <AddIcon />}>
                Add new paragraph
            </Button>}

            <Paragraph
                documentId={params.documentId}
                selected={selected}
                paragraph={props.paragraph}
                commit={props.commit}
            />

            {selected && <Button
            className={classes.button}
                color="primary"
                onClick={() => selectIndex(index + 1)}
                startIcon={selectedIndex === (index + 1) ? <ArrowForwardIcon /> : <AddIcon />}>
                Add new paragraph
            </Button>}
        </div>
    )
}

export default withTracker(({ _id }: { _id: string, index: number, selectedIndex: number, selectIndex: (index: number) => void }) => {
    return {
        paragraph: ParagraphCollection.findOne(_id),
        commit: CommitCollection.findOne({
            userId: Meteor.userId() as string,
            paragraphId: _id,
        }),
    }
})(ParagraphContainer);