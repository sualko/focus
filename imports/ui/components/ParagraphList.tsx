import { Button, makeStyles, Theme, createStyles } from '@material-ui/core';

import React, { useEffect, useState } from 'react';
import { Format, submitParagraph } from '../../api/paragraphs';
import ParagraphContainer from '../container/ParagraphContainer';
import { useRouteMatch, useHistory } from 'react-router-dom';
import ParagraphNew from './ParagraphNew';
import { Meteor } from 'meteor/meteor';
import { CommentType } from '/imports/api/comments';
import AddIcon from '@material-ui/icons/Add';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';

export const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        button: {

        },
        paragraph: {
            margin: theme.spacing(3, 0),
        },
    }),
)

type Props = {
    ids: string[];
};

const ParagraphList: React.FC<Props> = ({ ids }) => {
    const classes = useStyles();
    const matches = useRouteMatch<{documentId: string, paragraphId: string}>();

    const [index, setIndex] = useState<number>(-1);

    const submit = (document) => {
        return submitParagraph(matches.params.documentId, index, document).then(() => {
            setIndex(-1);
        });
    }

    return (<>
        {ids.length === 0 && <Button
                className={classes.button}
                color="primary"
                onClick={() => setIndex(0)}
                startIcon={0 === index ? <ArrowForwardIcon /> : <AddIcon />}>
                Add new paragraph
            </Button>}

        {ids.map((id, i) => {
            return <ParagraphContainer key={id} _id={id} index={i} selectedIndex={index} selectIndex={setIndex} />;
        })}

        <ParagraphNew submit={submit} isOpen={index > -1} close={() => setIndex(-1)} />
    </>);
};

export default ParagraphList;
