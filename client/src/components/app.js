import React from 'react';
import {connect} from 'react-redux';
import {Route, withRouter} from 'react-router-dom';

import HeaderBar from './header-bar';
import LandingPage from './landing-page';
import Dashboard from './dashboard';
import RegistrationPage from './registration-page';
import {refreshAuthToken, showLogoutWarning, setTimestamp, clearAuth} from '../actions/auth';

export class App extends React.Component {

    componentDidUpdate(prevProps) {
        if (!prevProps.loggedIn && this.props.loggedIn) {
            // When we are logged in, refresh the auth token periodically
            this.startPeriodicRefresh();
            this.props.dispatch(setTimestamp(Date.now()));
            this.logoutInterval = setInterval(this.autoLogout, 1000); // FIXME:
        } else if (prevProps.loggedIn && !this.props.loggedIn) {
            // Stop refreshing when we log out
            this.stopPeriodicRefresh();
            //this.stopLogoutTimer();
        }
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
    console.log('autoLogout called');
      const diff = Date.now() - this.props.time;
      if (diff >= 1 * 15 * 1000) {
        this.props.dispatch(clearAuth())
        clearInterval(this.logoutInterval);
        this.props.dispatch(showLogoutWarning(false));
      } else if(diff >=  1 * 5 * 1000 && !this.props.showLogoutWarning) {
        this.props.dispatch(showLogoutWarning(true));
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
  time: state.auth.time,
  showedLogoutWarning: state.auth.showedLogoutWarning
});

// Deal with update blocking - https://reacttraining.com/react-router/web/guides/dealing-with-update-blocking
export default withRouter(connect(mapStateToProps)(App));
