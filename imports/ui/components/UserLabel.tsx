import React from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { Meteor } from 'meteor/meteor';
import Avatar from './Avatar';
import { Typography } from '@material-ui/core';
import { withTracker } from 'meteor/react-meteor-data';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        avatar: {
            width: theme.spacing(4),
            height: theme.spacing(4),
            marginRight: theme.spacing(1),
        },
        avatarOnly: {
            width: theme.spacing(4),
            height: theme.spacing(4),
        }
    }),
)

type Props = {
    _id: string
    user: Meteor.User | undefined
    avatarOnly?: boolean
}

const UserLabel: React.FC<Props> = ({user, avatarOnly=false}) => {
    const classes = useStyles();

    if (!user) {
        return <></>;
    }

    if (avatarOnly) {
        return <Avatar user={user} />;
    }

    return (
        <>
            <Avatar className={classes.avatar} user={user} />

            <Typography variant="body2">{user.profile.name}</Typography>
        </>
    )
}

export default withTracker(({_id}: {_id: string, avatarOnly?: boolean}) => {
    return {
        user: Meteor.users.findOne(_id),
    }
})(UserLabel);