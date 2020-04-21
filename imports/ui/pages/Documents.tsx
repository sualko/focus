import { Grid } from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { withTracker } from 'meteor/react-meteor-data'
import React from 'react'
import { DocumentCollection, DocumentDocument } from '../../api/documents'
import DecentAppBar from '../components/DecentAppBar'
import SidebarLayout from '../layouts/SidebarLayout'
import DocumentCard from '../components/DocumentCard'
import DocumentNew from '../components/DocumentNew'

export const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        button: {
            margin: theme.spacing(3, 0),
        },
        main: {
            flexGrow: 1,
            padding: theme.spacing(3),
            marginLeft: 240,
            width: 'auto',
        },
        document: {

        },
        details: {
            // padding: theme.spacing(3),
            // borderRadius: theme.spacing(3),
            // backgroundColor: 'white',
        }
    }),
)

type Props = {
    documents: DocumentDocument[],
};

const Documents: React.FC<Props> = ({ documents }) => {
    const classes = useStyles();

    return (
        <SidebarLayout>
            <DecentAppBar title="Documents" />

            <Grid component="main" container spacing={0} className={classes.main}>
                <Grid item xs={12}>
                    <DocumentNew />
                </Grid>

                <Grid item xs={12} className={classes.document}>
                    {documents.map(document => <DocumentCard key={document._id} document={document} />)}
                </Grid>
            </Grid>
        </SidebarLayout>
    )
}

export default withTracker((props: any) => {
    return {
        documents: DocumentCollection.find({}, { sort: { createdAt: -1 } }).fetch(),
    }
})(Documents);