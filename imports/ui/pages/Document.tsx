import { Grid, Hidden } from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data'
import React, { useEffect, useState } from 'react'
import { RouteChildrenProps, useHistory, useRouteMatch } from "react-router-dom"
import { DocumentCollection, DocumentDocument } from '../../api/documents'
import DecentAppBar from '../components/DecentAppBar'
import { DrawerWidth } from '../components/FullHeightDrawer'
import ParagraphList from '../components/ParagraphList'
import TextList from '../components/TextList'
import SidebarLayout from '../layouts/SidebarLayout'
import ctx from 'classnames';

export const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        button: {
            margin: theme.spacing(3, 0),
        },
        main: {
            flexGrow: 1,
            width: 'auto',
            paddingBottom: 120,
        },
        document: {
            padding: theme.spacing(3),
        },
        details: {
            padding: theme.spacing(3),
            // padding: theme.spacing(3),
            // borderRadius: theme.spacing(3),
            // backgroundColor: 'white',
        },
        muted: {
            opacity: 0.6,
            textAlign: 'center',
            fontStyle: 'italic',
        },
        miniMapContainer: {
            position: 'fixed',
            top: theme.spacing(8),
            right: theme.spacing(1),
            bottom: 0,
            display: 'flex',
            width: 3,
            flexDirection: 'column',
        },
        miniMapItem: {
            backgroundColor: theme.palette.primary.light,
            borderRadius: theme.spacing(1),
            opacity: 0.5,
            marginBottom: 3,
            flexGrow: 1,
        },
        miniMapItemSelected: {
            backgroundColor: theme.palette.primary.dark,
            opacity: 1,
        }
    }),
)

type Props = {
    document: DocumentDocument | undefined,
    users: Meteor.User[],
} & RouteChildrenProps<{ paragraphId?: string }>;

const htmlDocument = document;

const Document: React.FC<Props> = ({ document, users, match }) => {
    const classes = useStyles();
    const matches = useRouteMatch<{ documentId: string, paragraphId: string }>();
    const history = useHistory();
    const [drawerWidth, setDrawerWidth] = useState<DrawerWidth>(DrawerWidth.normal);

    useEffect(() => {
        function keyDownHandler(ev) {
            const ids = document?.paragraphs || [];
            const pid = matches?.params.paragraphId || ids[0];
            let newId;

            if (!pid) {
                return;
            }

            if (ev.code === 'ArrowLeft') {
                newId = ids[ids.indexOf(pid) - 1];
            } else if (ev.code === 'ArrowRight') {
                newId = ids[ids.indexOf(pid) + 1];
            }

            if (newId) {
                let url = matches.url.indexOf(pid) > -1 ? matches.url.replace(pid, newId) : matches.url + '/' + newId;

                history.push(url);
            }
        }

        htmlDocument.addEventListener('keydown', keyDownHandler);

        return () => {
            htmlDocument.removeEventListener('keydown', keyDownHandler);
        }
    });

    if (!document || !document._id) {
        return <div>Waiting...</div>;
    }

    return (
        <SidebarLayout drawerWidth={drawerWidth}>
            <DecentAppBar setDrawerWidth={setDrawerWidth} drawerWidth={drawerWidth} title={document.title} users={users} />

            <Grid component="main" container spacing={0} className={classes.main}>
                <Hidden only={match?.params.paragraphId ? ["xs", "sm", "md"] : undefined}>
                    <Grid item xs={12} lg={6} className={classes.document}>
                        <ParagraphList ids={document.paragraphs} />
                    </Grid>
                </Hidden>

                <Grid item xs={12} lg={6} className={classes.details}>
                    {match?.params.paragraphId ? <TextList index={document.paragraphs.indexOf(match.params.paragraphId)} paragraphId={match.params.paragraphId} /> : <p className={classes.muted}>No paragraph selected</p>}
                </Grid>

                <Hidden lgUp>
                    <div className={classes.miniMapContainer}>
                        {document.paragraphs.map(paragraph => {
                            return <div key={paragraph} className={ctx(classes.miniMapItem, {
                                [classes.miniMapItemSelected]: match?.params.paragraphId === paragraph,
                            })}></div>;
                        })}
                    </div>
                </Hidden>
            </Grid>
        </SidebarLayout>
    )
}

export default withTracker((props: any) => {
    const documentId = props.match.params.documentId;

    console.log('documentId', documentId);

    return {
        document: DocumentCollection.findOne(documentId),
        users: Meteor.users.find().fetch(),
    }
})(Document);