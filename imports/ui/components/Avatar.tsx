import React from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import colorGeneration from 'consistent-color-generation';
import { Avatar as MUIAvatar } from '@material-ui/core';
import { Meteor } from 'meteor/meteor';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({

    }),
)

type Props = {
    user: Meteor.User
    className?: string
}

const Avatar: React.FC<Props> = (props) => {
    const classes = useStyles();

    const {user} = props;
    const avatarColor = colorGeneration(user._id);

    delete props.user;

    return (
        <MUIAvatar className={props.className} style={{backgroundColor: avatarColor.toString()}}>{user.profile.name[0]}</MUIAvatar>
    )
}

export default Avatar;