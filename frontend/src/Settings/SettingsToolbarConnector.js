import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { toggleAdvancedSettings } from 'Store/Actions/settingsActions';
import SettingsToolbar from './SettingsToolbar';

function mapStateToProps(state) {
  return {
    advancedSettings: state.settings.advancedSettings
  };
}

const mapDispatchToProps = {
  toggleAdvancedSettings
};

class SettingsToolbarConnector extends Component {

  //
  // Lifecycle

  constructor(props, context) {
    super(props, context);

    this.state = {
      nextLocation: null,
      confirmed: false
    };

    this._unsetRouterLeaveHook = null;
  }

  componentDidMount() {
    this._unsetRouterLeaveHook = this.props.router.setRouteLeaveHook(
      this.props.router.routes.slice(-1)[0],
      this.routerWillLeave
    );
  }

  componentWillUnmount() {
    if (this._unsetRouterLeaveHook) {
      this._unsetRouterLeaveHook();
    }
  }

  //
  // Control

  routerWillLeave = (nextLocation) => {
    if (this.state.confirmed) {
      this.setState({
        nextLocation: null,
        confirmed: false
      });

      return true;
    }

    if (this.props.hasPendingChanges ) {
      this.setState({
        nextLocation
      });

      return false;
    }

    return true;
  }

  //
  // Listeners

  onAdvancedSettingsPress = () => {
    this.props.toggleAdvancedSettings();
  }

  onConfirmNavigation = () => {
    const nextLocation = this.state.nextLocation;
    const action = nextLocation.action.toLowerCase();
    const router = this.props.router;
    const path = `${nextLocation.pathname}${nextLocation.search}`;

    this.setState({
      confirmed: true
    }, () => {
      if (router[action]) {
        router[action](path);
      } else {
        router.push(path);
      }
    });
  }

  onCancelNavigation = () => {
    this.setState({
      nextLocation: null,
      confirmed: false
    });
  }

  //
  // Render

  render() {
    const hasPendingLocation = this.state.nextLocation !== null;

    return (
      <SettingsToolbar
        hasPendingLocation={hasPendingLocation}
        onSavePress={this.props.onSavePress}
        onAdvancedSettingsPress={this.onAdvancedSettingsPress}
        onConfirmNavigation={this.onConfirmNavigation}
        onCancelNavigation={this.onCancelNavigation}
        {...this.props}
      />
    );
  }
}

const routerShape = {
  routes: PropTypes.arrayOf(PropTypes.object).isRequired,
  setRouteLeaveHook: PropTypes.func.isRequired
};

SettingsToolbarConnector.propTypes = {
  hasPendingChanges: PropTypes.bool.isRequired,
  router: PropTypes.shape(routerShape).isRequired,
  onSavePress: PropTypes.func,
  toggleAdvancedSettings: PropTypes.func.isRequired
};

SettingsToolbarConnector.defaultProps = {
  hasPendingChanges: false
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SettingsToolbarConnector));
