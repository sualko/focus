import React from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import SidebarLayout from '../layouts/SidebarLayout';
import DecentAppBar from '../components/DecentAppBar';
import { Grid, Table, TableHead, TableRow, TableCell, TableBody } from '@material-ui/core';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import UserNew from '../components/UserNew';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        main: {
            flexGrow: 1,
            marginLeft: 240,
            width: 'auto',
            padding: theme.spacing(3),
            paddingBottom: 120,
        },
        avatar: {
            display: 'inline-block',

        }
    }),
)

type Props = {
    users: Meteor.User[],
}

const Users: React.FC<Props> = ({users}) => {
    const classes = useStyles();

    return (
        <SidebarLayout>
            <DecentAppBar title="User management" />

            <Grid component="main" container spacing={3} className={classes.main}>

                <Grid item xs={12} lg={6}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Id</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Username</TableCell>
                                <TableCell>Mail</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.map(user => (
                                <TableRow key={user._id}>
                                    <TableCell>{user._id}</TableCell>
                                    <TableCell>{user.profile.name}</TableCell>
                                    <TableCell>{user.username}</TableCell>
                                    <TableCell>{user.emails ? user.emails[0].address : ''}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Grid>

                <Grid item xs={12} lg={6}>
                    <UserNew />
                </Grid>
            </Grid>
        </SidebarLayout>
    )
}

export default withTracker(() => {
    return {
        users: Meteor.users.find().fetch(),
    }
})(Users);