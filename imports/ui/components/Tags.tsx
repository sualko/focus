import React, { useState } from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import PlusIcon from '@material-ui/icons/Add'
import { TagDocument, TagCollection, insertTag, deleteTag } from '/imports/api/tags';
import { withTracker } from 'meteor/react-meteor-data';
import TagNew from './TagNew';
import { Chip, IconButton } from '@material-ui/core';
import colorGeneration from 'consistent-color-generation';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        tag: {
            // color: '#ffffff',
        }
    }),
)

type ExternalProps = {
    textId: string
    documentId: string
}

type Props = {
    usedTags: TagDocument[]
    tags: TagDocument[]
} & ExternalProps;

const Tags: React.FC<Props> = (props) => {
    const classes = useStyles();

    const [isTagDialogOpen, setTagDialogOpen] = useState<boolean>(false);

    const submitNewTag = ({label}: {label: string}) => {
        return insertTag({
            label,
            documentId: props.documentId,
            textId: props.textId,
        }).then(() => {

        });
    }

    const onDeleteTag = (id: string) => {
        deleteTag(id);
    }

    return (
        <>
            <IconButton size="small" onClick={ev => {ev.preventDefault(); setTagDialogOpen(true);}}>
                <PlusIcon />
            </IconButton>

            {props.tags.map(tag => <Chip key={tag._id} className={classes.tag} style={{backgroundColor: colorGeneration(tag.label, undefined, undefined, 80).toString()}} label={tag.label} size="small" onDelete={() => onDeleteTag(tag._id)} />)}

            <TagNew usedTags={props.usedTags} isOpen={isTagDialogOpen} close={() => setTagDialogOpen(false)} submit={submitNewTag} />
        </>
    )
}

export default withTracker((props: ExternalProps) => {
    return {
        usedTags: TagCollection.find({documentId: props.documentId}).fetch(),
        tags: TagCollection.find({textId: props.textId}).fetch(),
    };
})(Tags);