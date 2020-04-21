import React, { useState } from 'react';
import Box from '@material-ui/core/Box';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import SignInForm from '../components/SignInForm';
import FullPageLayout from '../layouts/FullPageLayout';
import { Meteor } from 'meteor/meteor';
import { Redirect } from "react-router-dom";

const useStyles = makeStyles(() => ({
  root: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
}));

const SignIn: React.FC = () => {
  const classes = useStyles();
  const [error, setError] = useState('');
  const [isAuthenticated, setAuthenticated] = useState(!!Meteor.userId());

  const submit = (email: string, password: string) => {
    Meteor.loginWithPassword(email, password, (err) => {
      if (!err) {
        setAuthenticated(true);
        return;
      }

      console.log(err);

      setError(err.toString());
    });
  }

  return (
    isAuthenticated ? <Redirect to="/documents" /> :
    <FullPageLayout>
      <Box component="main" className={classes.root}>
        <SignInForm submit={submit} error={error} />

        <Box mt={8}>
          <Typography variant="body2" style={{ color: 'rgba(255,255,255,0.7)' }} align="center">
            {'Copyright © '}
            <Link color="inherit" href="https://studio.herberth.eu/">Studio Herberth</Link>{' '}
            {new Date().getFullYear()}
            {'.'}
          </Typography>
        </Box>
      </Box>
    </FullPageLayout>
  );
}

export default SignIn;