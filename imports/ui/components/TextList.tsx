import { Typography, IconButton, Box, Hidden, Button } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { withTracker } from 'meteor/react-meteor-data';
import React, { useState } from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import TextDetail from './TextDetail';
import TextEdit from './TextEdit';
import TextNew from './TextNew';
import { ParagraphCollection, ParagraphDocument, submitParagraph } from '/imports/api/paragraphs';
import { TextCollection, TextDocument } from '/imports/api/texts';
import CloseIcon from '@material-ui/icons/Close';
import { Link as RouterLink } from 'react-router-dom';
import AddIcon from '@material-ui/icons/Add';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import ParagraphNew from './ParagraphNew';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        body: {
            backgroundColor: '#e8e8e8',
        },
        root: {
            position: 'relative',
            backgroundColor: '#fafafa',
            padding: theme.spacing(3),
            borderRadius: theme.spacing(3),
            marginBottom: theme.spacing(3),
        },
        close: {
            float: 'right',
            marginTop: theme.spacing(-2),
        },
        button: {
            margin: theme.spacing(3, 0, 3, 3),
        }
    }),
)

type ExternalProps = {
    paragraphId: string
    index: number
}

type Props = {
    paragraph: ParagraphDocument | undefined
    texts: TextDocument[]
} & ExternalProps

const TextList: React.FC<Props> = ({ texts, paragraph, index }) => {
    const classes = useStyles();
    const matches = useRouteMatch<{ documentId: string, paragraphId: string, baseTextId?: string }>();

    const [selectedIndex, selectIndex] = useState<number>(-1);

    const selectedText = texts.find(text => text._id === paragraph?.selectedId);

    const submit = (document) => {
        return submitParagraph(matches.params.documentId, selectedIndex, document).then(() => {
            selectIndex(-1);
        });
    }

    return (
        <div className={classes.root}>
            <Hidden only={["xs", "sm", "md"]}>
                <div style={{ height: Math.max(document.documentElement.scrollTop - 64, 0) }}></div>
            </Hidden>
            <Switch>
                <Route path={`${matches.url}/new/:textId`} >
                    <TextNew baseUrl={matches.url} />
                </Route>
                <Route path={`${matches.url}/edit/:textId`} render={props => <TextEdit match={props.match} baseUrl={matches.url} />} >

                </Route>
                <Route>
                    {paragraph?.deleted ?
                        <>
                            <Typography variant="h6">This paragraph was deleted</Typography>
                            <Typography>{selectedText?.content}</Typography>
                        </>
                        :
                        <>
                            <IconButton className={classes.close} component={RouterLink} to={`/document/${matches.params.documentId}`}><CloseIcon /></IconButton>
                            <Typography variant="h6">Current</Typography>

                            <Hidden lgUp>
                                <Button
                                    className={classes.button}
                                    color="primary"
                                    onClick={() => selectIndex(index)}
                                    startIcon={selectedIndex === index ? <ArrowForwardIcon /> : <AddIcon />}>
                                    Add new paragraph
                        </Button>
                            </Hidden>

                            {selectedText && <TextDetail readonly={true} text={selectedText} />}

                            <Hidden lgUp>
                                <Button
                                    className={classes.button}
                                    color="primary"
                                    onClick={() => selectIndex(index + 1)}
                                    startIcon={selectedIndex === (index + 1) ? <ArrowForwardIcon /> : <AddIcon />}>
                                    Add new paragraph
                        </Button>
                            </Hidden>

                            <Typography style={{marginTop: 72}} variant="h6">Alternatives</Typography>

                            {texts.map(text => text._id === paragraph?.selectedId ? undefined : (
                                <TextDetail key={text._id} text={text} />
                            ))}
                        </>}
                </Route>
            </Switch>

            <ParagraphNew submit={submit} isOpen={selectedIndex > -1} close={() => selectIndex(-1)} />
        </div >
    )
}

export default withTracker(({ paragraphId }: ExternalProps) => {
    return {
        paragraph: ParagraphCollection.findOne(paragraphId),
        texts: TextCollection.find({ paragraphId }).fetch(),
    }
})(TextList);