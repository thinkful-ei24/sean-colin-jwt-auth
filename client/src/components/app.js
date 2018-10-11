import React from 'react';
import {connect} from 'react-redux';
import {Route, withRouter} from 'react-router-dom';

import HeaderBar from './header-bar';
import LandingPage from './landing-page';
import Dashboard from './dashboard';
import RegistrationPage from './registration-page';
import {refreshAuthToken, checkTimestamp, setTimestamp, clearAuth} from '../actions/auth';

export class App extends React.Component {
  // Current plan:
  // Set a timer that fires a CHECK_TIMESTAMP event every second
  // On the reducer for CHECK_TIMESTAMP, calculate the difference between then and now
  // Depending on that result, either log out or update timestamp
  // (TIMESTAMP is currently an action, so this would require two actions)


    componentDidUpdate(prevProps) {
        if (!prevProps.loggedIn && this.props.loggedIn) {
            // When we are logged in, refresh the auth token periodically
            this.startPeriodicRefresh();
            this.props.dispatch(setTimestamp(Date.now()));
            setInterval(this.autoLogout, 1000); // FIXME:
        } else if (prevProps.loggedIn && !this.props.loggedIn) {
            // Stop refreshing when we log out
            this.stopPeriodicRefresh();
        }
        this.stopLogoutTimer(); // FIXME:
    }

    componentWillUnmount() {
        this.stopPeriodicRefresh();
    }

    startPeriodicRefresh() {
        this.refreshInterval = setInterval(
            () => this.props.dispatch(refreshAuthToken()),
            10 * 60 * 1000 // Ten minutes
        );
    }

  autoLogout = () => {
      const timeStamp = this.props.time;
      if (5 * 60 * 1000 <= Date.now() - timeStamp ) {
        //clearInterval(this.refreshInterval);
        this.props.dispatch(clearAuth())
      } else {
      }
    }

  stopLogoutTimer() {
    if (!this.refreshInterval) {
      return
    }
    clearInterval(this.refreshInterval);
  }

    stopPeriodicRefresh() {
        if (!this.refreshInterval) {
            return;
        }

        clearInterval(this.refreshInterval);
    }

    render() {
        return (
            <div className="app">
                <HeaderBar />
                <Route exact path="/" component={LandingPage} />
                <Route exact path="/dashboard" component={Dashboard} />
                <Route exact path="/register" component={RegistrationPage} />
            </div>
        );
    }
}

const mapStateToProps = state => ({
  hasAuthToken: state.auth.authToken !== null,
  loggedIn: state.auth.currentUser !== null,
  time: state.auth.time
});

// Deal with update blocking - https://reacttraining.com/react-router/web/guides/dealing-with-update-blocking
export default withRouter(connect(mapStateToProps)(App));
