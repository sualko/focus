import React from 'react';
import {
  Redirect,
  Route
} from "react-router-dom";
import { Meteor } from 'meteor/meteor';

const UnprotectedRoute: React.FC = ({ children, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props =>
        !Meteor.userId()
          ? children
          : <Redirect
            to={`/`}
          />}
    />
  );
}

export default UnprotectedRoute;