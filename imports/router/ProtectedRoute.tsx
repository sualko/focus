import React from 'react';
import {
  Redirect,
  Route,
  RouteProps
} from "react-router-dom";
import { Meteor } from 'meteor/meteor';

type Props = {

} & RouteProps

const ProtectedRoute: React.FC<Props> = ({ component, ...rest }) => {
  return (
    Meteor.userId() ? <Route {...rest} component={ component } /> :
    <Redirect to={`/signin?redirect=${rest.location?.pathname}${rest.location?.search}`}
  />
  );
}

export default ProtectedRoute;