import React from 'react';
import { BrowserRouter as Router, Link } from "react-router-dom";
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider, createMuiTheme } from '@material-ui/core';
import { Switch, Route } from "react-router-dom";
import routes from '../router/routes';
import ProtectedRoute from '../router/ProtectedRoute';

const theme = createMuiTheme({
  typography: {
    h1: {
      fontSize: '3rem',
    },
    h2: {
      fontSize: '2.5rem',
      fontWeight: 400,
    },
    h3: {
      fontSize: '2.25rem',
      fontWeight: 300,
    }
  },
  palette: {
    primary: {
      main: 'rgb(0, 115, 157)'
    },
    secondary: {
      main: "#f48fb1"
    }
  },
  overrides: {
    MuiDrawer: {
      paper: {
        background: 'rgb(0, 115, 157)',
        '& *': { color: 'rgba(255, 255, 255, 1)' },
      }
    },
    MuiAppBar: {
      root: {
        boxShadow: 'none',
        width: 'auto',
      },
      colorTransparent: {
        color: 'rgba(0,0,0,0.4)',
      },
    } as any,
    MuiPaper: {
      root: {

      },
      rounded: {
        borderRadius: 24,
      },
      elevation1: {
        boxShadow: 'none',
      }
    }
  }
})

// #b7b7b7

export const App = () => (
  <ThemeProvider theme={theme}>
    <Router>
      <CssBaseline />

      <Switch>
        {routes.map(route =>
          route.protected ? <ProtectedRoute key={route.path} path={route.path} component={route.component} /> :
            <Route key={route.path} path={route.path} component={route.component} />
        )}
        <Route path="/" exact={true}>
          <h1>Home</h1>
          <Link to="/signin">Sign In</Link>
        </Route>
        <Route path="/">
          <h1>404 Not found</h1>
        </Route>
      </Switch>
    </Router>
  </ThemeProvider>
);
