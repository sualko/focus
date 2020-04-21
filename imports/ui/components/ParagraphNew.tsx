import React, { useState, FormEvent } from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { Format } from '/imports/api/paragraphs';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        form: {
            '&>*': {
                marginBottom: theme.spacing(1),
            }
        }
    }),
)

type Props = {
    isOpen: boolean,
    close: () => void,
    submit: (document: { format: Format, content: string, comment: string }) => Promise<void>,
}

const ParagraphNew: React.FC<Props> = ({ isOpen, close, submit }) => {
    const classes = useStyles();

    const [format, setFormat] = useState<Format>(Format.Text);
    const [content, setContent] = useState<string>('');
    const [comment, setComment] = useState<string>('');

    const clear = () => {
        setFormat(Format.Text);
        setContent('');
        setComment('');
    }

    const onSubmit = (ev: FormEvent) => {
        ev.preventDefault();

        submit({
            format,
            content,
            comment,
        }).then(() => {
            clear();
        }).catch(err => {

        });
    }

    return (
        <Dialog open={isOpen} onClose={close} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">New Paragraph</DialogTitle>
            <form onSubmit={onSubmit} className={classes.form}>
                <DialogContent>
                    <DialogContentText>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                        eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </DialogContentText>


                    <FormControl>
                        <InputLabel id="demo-simple-select-label">Format</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={format}
                            onChange={ev => setFormat(ev.target.value as Format)}
                        >
                            {Object.keys(Format).map(f => <MenuItem key={f} value={Format[f as (keyof typeof Format)]}>{f}</MenuItem>)}
                        </Select>
                    </FormControl>

                    <TextField label="New text" required multiline rows={4} fullWidth value={content} onChange={ev => setContent(ev.target.value)}></TextField>

                    <TextField label="Comment" required fullWidth value={comment} onChange={ev => setComment(ev.target.value)}></TextField>

                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {clear(); close();}} color="primary">Cancel</Button>
                    <Button type="submit" color="primary">Save</Button>
                </DialogActions>
            </form>
        </Dialog >
    )
}

export default ParagraphNew;