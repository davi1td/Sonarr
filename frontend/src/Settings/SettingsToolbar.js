import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import { icons } from 'Helpers/Props';
import keyboardShortcuts, { shortcuts } from 'Components/keyboardShortcuts';
import PageToolbar from 'Components/Page/Toolbar/PageToolbar';
import PageToolbarSection from 'Components/Page/Toolbar/PageToolbarSection';
import PageToolbarButton from 'Components/Page/Toolbar/PageToolbarButton';
import PendingChangesModal from './PendingChangesModal';
import styles from './SettingsToolbar.css';

class SettingsToolbar extends Component {

  //
  // Lifecycle

  componentWillMount() {
    this.props.bindShortcut(shortcuts.SAVE_SETTINGS.key, this.saveSettings, { isGlobal: true });
  }

  //
  // Control

  saveSettings = (event) => {
    event.preventDefault();

    const {
      hasPendingChanges,
      onSavePress
    } = this.props;

    if (hasPendingChanges) {
      onSavePress();
    }
  }

  //
  // Render

  render() {
    const {
      advancedSettings,
      showSave,
      isSaving,
      hasPendingChanges,
      hasPendingLocation,
      onSavePress,
      onConfirmNavigation,
      onCancelNavigation,
      onAdvancedSettingsPress
    } = this.props;

    return (
      <PageToolbar>
        <PageToolbarSection>
          <PageToolbarButton
            className={classNames(
              styles.advancedSettings,
              advancedSettings && styles.advancedSettingsEnabled
            )}
            iconName={icons.ADVANCED_SETTINGS}
            title="Advanced Settings"
            onPress={onAdvancedSettingsPress}
          />

          {
            showSave &&
              <PageToolbarButton
                iconName={icons.SAVE}
                title="Save"
                isSpinning={isSaving}
                isDisabled={!hasPendingChanges}
                onPress={onSavePress}
              />
          }
        </PageToolbarSection>
        <PendingChangesModal
          isOpen={hasPendingLocation}
          onConfirm={onConfirmNavigation}
          onCancel={onCancelNavigation}
        />
      </PageToolbar>
    );
  }
}

SettingsToolbar.propTypes = {
  advancedSettings: PropTypes.bool.isRequired,
  showSave: PropTypes.bool.isRequired,
  isSaving: PropTypes.bool,
  hasPendingLocation: PropTypes.bool.isRequired,
  hasPendingChanges: PropTypes.bool,
  onSavePress: PropTypes.func,
  onAdvancedSettingsPress: PropTypes.func.isRequired,
  onConfirmNavigation: PropTypes.func.isRequired,
  onCancelNavigation: PropTypes.func.isRequired,
  bindShortcut: PropTypes.func.isRequired
};

SettingsToolbar.defaultProps = {
  showSave: true
};

export default keyboardShortcuts(SettingsToolbar);
