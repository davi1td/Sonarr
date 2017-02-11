import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import sortByName from 'Utilities/Array/sortByName';
import SelectInput from './SelectInput';

function createMapStateToProps() {
  return createSelector(
    (state) => state.settings.languageProfiles,
    (state, { includeNoChange }) => includeNoChange,
    (languageProfiles, includeNoChange) => {
      const values = _.map(languageProfiles.items.sort(sortByName), (languageProfile) => {
        return {
          [languageProfile.id]: languageProfile.name
        };
      });

      if (includeNoChange) {
        values.unshift({
          'noChange': 'No Change'
        });
      }

      return {
        values
      };
    }
  );
}

class LanguageProfileSelectInputConnector extends Component {

  //
  // Lifecycle

  componentWillMount() {
    const {
      name,
      value,
      values
    } = this.props;

    if (!value || !_.some(values, (option) => parseInt(_.keys(option)[0]) === value)) {
      this.onChange({ name, value: _.keys(values[0])[0] });
    }
  }

  //
  // Listeners

  onChange = ({ name, value }) => {
    this.props.onChange({ name, value: parseInt(value) });
  }

  //
  // Render

  render() {
    return (
      <SelectInput
        {...this.props}
        onChange={this.onChange}
      />
    );
  }
}

LanguageProfileSelectInputConnector.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  values: PropTypes.arrayOf(PropTypes.object).isRequired,
  includeNoChange: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired
};

LanguageProfileSelectInputConnector.defaultProps = {
  includeNoChange: false
};

export default connect(createMapStateToProps)(LanguageProfileSelectInputConnector);
