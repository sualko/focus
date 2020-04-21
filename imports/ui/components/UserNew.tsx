import { Box, Button, Checkbox, FormControl, Grid, Input, InputLabel, ListItemText, MenuItem, Select, TextField } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import CancelIcon from '@material-ui/icons/Cancel';
import SaveIcon from '@material-ui/icons/Save';
import React, { useState, FormEvent } from 'react';
import { Accounts } from 'meteor/accounts-base'
import Alert from '@material-ui/lab/Alert';
import { Meteor } from 'meteor/meteor';

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

type Props = {

}

const UserNew: React.FC<Props> = (props) => {
    const classes = useStyles();

    const [processing, setProcessing] = useState<boolean>(false);
    const [error, setError] = useState('');

    const [name, setName] = useState<string>('');
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [email, setEmail] = useState<string>('');

    function clearForm() {
        setName('');
        setUsername('');
        setPassword('');
        setEmail('');
    }

    function onSubmit(ev: FormEvent) {
        ev.preventDefault();

        setProcessing(true);

        Accounts.createUser({
            username,
            email,
            password,
            profile: {
                name
            }
        }, err => {
            if (err) {
                setError(err.toString());
                return;
            }

            setProcessing(false);
            clearForm();
        });

    }

    return (
        <Box component="section" className={classes.root}>
            <form onSubmit={onSubmit}>
                <TextField
                    label="Name"
                    required
                    variant="outlined"
                    fullWidth
                    className={classes.input}
                    value={name}
                    onChange={ev => setName(ev.target.value)}></TextField>

                <TextField
                    label="Username"
                    required
                    variant="outlined"
                    fullWidth
                    className={classes.input}
                    value={username}
                    inputProps={{ pattern: '^[a-z\.-]+$' }}
                    onChange={ev => setUsername(ev.target.value)}></TextField>

                <TextField
                    type="password"
                    label="Password"
                    required
                    variant="outlined"
                    fullWidth
                    className={classes.input}
                    value={password}
                    inputProps={{ autoComplete: 'new-password' }}
                    onChange={ev => setPassword(ev.target.value)}></TextField>

                <TextField
                    type="email"
                    label="Email"
                    required
                    variant="outlined"
                    fullWidth
                    className={classes.input}
                    value={email}
                    onChange={ev => setEmail(ev.target.value)}></TextField>

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

export default UserNew;