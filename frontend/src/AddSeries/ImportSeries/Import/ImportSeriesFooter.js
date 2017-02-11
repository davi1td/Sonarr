import React, { Component, PropTypes } from 'react';
import { inputTypes, kinds } from 'Helpers/Props';
import SpinnerButton from 'Components/Link/SpinnerButton';
import CheckInput from 'Components/Form/CheckInput';
import FormInputGroup from 'Components/Form/FormInputGroup';
import PageContentFooter from 'Components/Page/PageContentFooter';
import styles from './ImportSeriesFooter.css';

class ImportSeriesFooter extends Component {

  //
  // Lifecycle

  constructor(props, context) {
    super(props, context);

    const {
      defaultMonitor,
      defaultQualityProfileId,
      defaultLanguageProfileId,
      defaultSeasonFolder,
      defaultSeriesType
    } = props;

    this.state = {
      monitor: defaultMonitor,
      qualityProfileId: defaultQualityProfileId,
      languageProfileId: defaultLanguageProfileId,
      seriesType: defaultSeriesType,
      seasonFolder: defaultSeasonFolder
    };
  }

  //
  // Listeners

  onInputChange = ({ name, value }) => {
    this.setState({ [name]: value });
    this.props.onInputChange({ name, value });
  }

  //
  // Render

  render() {
    const {
      selectedCount,
      isImporting,
      isLookingUpSeries,
      showLanguageProfile,
      onImportPress
    } = this.props;

    const {
      monitor,
      qualityProfileId,
      languageProfileId,
      seriesType,
      seasonFolder
    } = this.state;

    return (
      <PageContentFooter>
        <div className={styles.inputContainer}>
          <div className={styles.label}>
            Monitor
          </div>

          <FormInputGroup
            type={inputTypes.MONITOR_EPISODES_SELECT}
            name="monitor"
            value={monitor}
            isDisabled={!selectedCount}
            onChange={this.onInputChange}
          />
        </div>

        <div className={styles.inputContainer}>
          <div className={styles.label}>
            Quality Profile
          </div>

          <FormInputGroup
            type={inputTypes.QUALITY_PROFILE_SELECT}
            name="qualityProfileId"
            value={qualityProfileId}
            isDisabled={!selectedCount}
            onChange={this.onInputChange}
          />
        </div>

        {
          showLanguageProfile &&

            <div className={styles.inputContainer}>
              <div className={styles.label}>
                Language Profile
              </div>

              <FormInputGroup
                type={inputTypes.LANGUAGE_PROFILE_SELECT}
                name="languageProfileId"
                value={languageProfileId}
                isDisabled={!selectedCount}
                onChange={this.onInputChange}
              />
            </div>
        }

        <div className={styles.inputContainer}>
          <div className={styles.label}>
            Series Type
          </div>

          <FormInputGroup
            type={inputTypes.SERIES_TYPE_SELECT}
            name="seriesType"
            value={seriesType}
            isDisabled={!selectedCount}
            onChange={this.onInputChange}
          />
        </div>

        <div className={styles.inputContainer}>
          <div className={styles.label}>
            Season Folder
          </div>

          <CheckInput
            name="seasonFolder"
            value={seasonFolder}
            isDisabled={!selectedCount}
            onChange={this.onInputChange}
          />
        </div>

        <div>
          <div className={styles.label}>
            &nbsp;
          </div>

          <SpinnerButton
            className={styles.importButton}
            kind={kinds.PRIMARY}
            isSpinning={isImporting}
            isDisabled={!selectedCount || isLookingUpSeries}
            onPress={onImportPress}
          >
            Import {selectedCount} Series
          </SpinnerButton>
        </div>
      </PageContentFooter>
    );
  }
}

ImportSeriesFooter.propTypes = {
  selectedCount: PropTypes.number.isRequired,
  isImporting: PropTypes.bool.isRequired,
  isLookingUpSeries: PropTypes.bool.isRequired,
  defaultMonitor: PropTypes.string.isRequired,
  defaultQualityProfileId: PropTypes.number,
  defaultLanguageProfileId: PropTypes.number,
  defaultSeriesType: PropTypes.string.isRequired,
  defaultSeasonFolder: PropTypes.bool.isRequired,
  showLanguageProfile: PropTypes.bool.isRequired,
  onInputChange: PropTypes.func.isRequired,
  onImportPress: PropTypes.func.isRequired
};

export default ImportSeriesFooter;
