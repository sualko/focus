import { Box, Button, Checkbox, FormControl, Grid, Input, InputLabel, ListItemText, MenuItem, Select, TextField, Typography } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import CancelIcon from '@material-ui/icons/Cancel';
import SaveIcon from '@material-ui/icons/Save';
import React, { useState, FormEvent } from 'react';
import { Meteor } from 'meteor/meteor';
import Alert from '@material-ui/lab/Alert';
import CKEditor from '@ckeditor/ckeditor5-react';
import BalloonEditor from '@ckeditor/ckeditor5-build-balloon';
import { submitParagraph } from '/imports/api/paragraphs';
// import PasteFromOffice from '@ckeditor/ckeditor5-paste-from-office/src/pastefromoffice';

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
        formControl: {
            margin: theme.spacing(1),
            minWidth: 120,
        },
        chips: {
            display: 'flex',
            flexWrap: 'wrap',
        },
        chip: {
            margin: 2,
        },
        previewItem: {
            marginBottom: theme.spacing(3),
        }
    }),
);

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

const names = [
    'Oliver Hansen',
    'Van Henry',
    'April Tucker',
    'Ralph Hubbard',
    'Omar Alexander',
    'Carlos Abbott',
    'Miriam Wagner',
    'Bradley Wilkerson',
    'Virginia Andrews',
    'Kelly Snyder',
];

type Props = {

}

// console.log('plugins', BalloonEditor.builtinPlugins.map(plugin => plugin.pluginName));

const DocumentNew: React.FC<Props> = (props) => {
    const classes = useStyles();
    const [personName, setPersonName] = useState<string[]>([]);

    const [processing, setProcessing] = useState<boolean>(false);
    const [error, setError] = useState('');

    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');

    const [preview, setPreview] = useState<{content: string, variant: 'h1' | 'h2' | 'h3' | 'body1'}[]>([]);

    const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setPersonName(event.target.value as string[]);
    };

    function clearForm() {
        setTitle('');
        setDescription('');
        setProcessing(false);
        setPreview([]);
    }

    function onSubmit(ev: FormEvent) {
        ev.preventDefault();

        setProcessing(true);

        const document = { title, description };

        Meteor.call('documents.insert', document, (err, _id) => {
            if (err) {
                setError(err.toString());
                console.warn('Error while creating document', err);
                return;
            }

            console.log('new id 2', _id)

            preview.forEach(async (p, index) => {
                let ids = await submitParagraph(_id, index, {
                    comment: 'Import',
                    format: p.variant === 'body1' ? 'text' : p.variant,
                    content: p.content,
                });

                Meteor.call('commits.paragraph', {
                    paragraphId: ids.paragraphId,
                    content: p.content,
                });

                Meteor.call('commits.text', {
                    textId: ids.textId,
                    content: p.content,
                });
            });

            clearForm();
        });
    }

    return (
        <Box component="section" className={classes.root}>
            <form onSubmit={onSubmit}>
                <TextField
                    label="Title"
                    required
                    variant="outlined"
                    fullWidth
                    className={classes.input}
                    value={title}
                    onChange={ev => setTitle(ev.target.value)}></TextField>

                <TextField
                    label="Description"
                    required
                    multiline
                    rows={4}
                    variant="outlined"
                    fullWidth
                    className={classes.input}
                    value={description}
                    onChange={ev => setDescription(ev.target.value)}></TextField>

                {/* <FormControl variant="outlined" className={classes.input}>
                    <InputLabel id="demo-mutiple-checkbox-label">Tag</InputLabel>
                    <Select
                        labelId="demo-mutiple-checkbox-label"
                        id="demo-mutiple-checkbox"
                        multiple
                        value={personName}
                        onChange={handleChange}
                        input={<Input />}
                        renderValue={(selected) => (selected as string[]).join(', ')}
                        MenuProps={MenuProps}
                    >
                        {names.map((name) => (
                            <MenuItem key={name} value={name}>
                                <Checkbox checked={personName.indexOf(name) > -1} />
                                <ListItemText primary={name} />
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl> */}

                <Grid container wrap="nowrap">
                    <Grid item xs={6}>
                        <CKEditor
                            editor={BalloonEditor}
                            data=""
                            config={{
                                height: '200px',
                                placeholder: 'New text',
                                extraPlugins: ['PasteFromOffice'],
                                removePlugins: ['Table', 'Link'],
                                toolbar: ['heading'],
                            }}
                            onChange={(event, editor) => {
                                const data = editor.getData();

                                console.log(data);

                                let domparser = new DOMParser();
                                let doc = domparser.parseFromString(data.replace(/&nbsp;/g, ' '), 'text/html');
                                let p = [];
                                let body = doc.documentElement.getElementsByTagName('body')[0];

                                for (let i = 0; i < body.children.length; i++) {
                                    const child = body.children[i];
                                    const tagName = child.tagName.toLowerCase();
                                    const content = child.textContent?.trim();

                                    console.log(child, tagName, content)

                                    let variant: 'h1' | 'h2' | 'h3' | 'body1';

                                    switch (tagName) {
                                        case 'h2': variant = 'h1';
                                            break;
                                        case 'h3': variant = 'h2';
                                            break;
                                        case 'h4': variant = 'h3';
                                            break;
                                        default: variant = 'body1';

                                    }

                                    if (content) {
                                        p.push({variant, content});
                                    }
                                }

                                setPreview(p);
                            }}
                        />
                    </Grid>

                    <Grid item xs={6}>
                        {preview.map(({variant, content}, index) => <Typography key={index} className={classes.previewItem} variant={variant}>{content}</Typography>)}
                    </Grid>
                </Grid>

                {error && <Alert severity="warning">{error}</Alert>}

                <Grid container wrap="nowrap">
                    <Button disabled={processing} color="secondary" startIcon={<CancelIcon />}>Cancel</Button>

                    <Box flexGrow={1}></Box>

                    <Button type="submit" disabled={processing} variant="contained" color="primary" startIcon={<SaveIcon />}>Save</Button>
                </Grid>
            </form>
        </Box>
    )
}

export default DocumentNew;