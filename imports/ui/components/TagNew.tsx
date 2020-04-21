import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import colorGeneration from 'consistent-color-generation';
import React, { FormEvent, useEffect, useState } from 'react';
import { TagDocument } from '/imports/api/tags';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        form: {

        },
        tag: {
            margin: theme.spacing(1),
        },
    }),
)

type Props = {
    usedTags: TagDocument[]
    isOpen: boolean,
    close: () => void,
    submit: (document: { label: string }) => Promise<void>,
}

const TagNew: React.FC<Props> = ({usedTags, isOpen, close, submit}) => {
    const classes = useStyles();

    const [label, setLabel] = useState<string>('');
    const [color, setColor] = useState<string>('#fff');

    useEffect(() => {
        setColor(!label ? '#fff' : colorGeneration(label, undefined, undefined, 80).toString());
    }, [label]);

    const clear = () => {
        setLabel('');
    }

    const onSubmit = (ev: FormEvent) => {
        ev.preventDefault();

        close();

        submit({label}).then(() => {
            clear();
        });
    }

    return (
        <Dialog open={isOpen} onClose={close} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">New Tag</DialogTitle>
        <form onSubmit={onSubmit} className={classes.form}>
            <DialogContent>
                <DialogContentText>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                    eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </DialogContentText>

                {usedTags.map(tag => <Button className={classes.tag} key={tag._id} onClick={() => setLabel(tag.label)} style={{backgroundColor: colorGeneration(tag.label, undefined, undefined, 80).toString()}}>{tag.label}</Button>)}

                <TextField label="Label" style={{backgroundColor: color}} required fullWidth value={label} onChange={ev => setLabel(ev.target.value)}></TextField>

            </DialogContent>
            <DialogActions>
                <Button onClick={() => {clear(); close();}} color="primary">Cancel</Button>
                <Button type="submit" color="primary">Add tag</Button>
            </DialogActions>
        </form>
    </Dialog >
    )
}

export default TagNew;