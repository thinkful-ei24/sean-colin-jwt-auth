import React from 'react';
import {connect} from 'react-redux';
import {showLogoutWarning, setTimestamp} from '../actions/auth';

class LogoutWarning extends React.Component {

  stillHere() {
    console.log('click');
    this.props.dispatch(showLogoutWarning(false));
    this.props.dispatch(setTimestamp(Date.now()));
    this.forceUpdate();
  }

  render() {
    let element = '';
    if(this.props.showLogoutWarning === true) {
      // dispatch for refreshToken, showLogoutWarning (don't have hideLogoutWarning)
      element =
        <div>
          Still here?
          <button onClick={() => this.stillHere()}>Yes</button>
        </div>
    } else {
      element = '';
    }
    return (
      element
    );
  };

}

const mapStateToProps = (state) => ({
  showLogoutWarning: state.auth.showLogoutWarning
});
export default connect(mapStateToProps)(LogoutWarning);