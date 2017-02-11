import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import formatBytes from 'Utilities/Number/formatBytes';
import selectAll from 'Utilities/Table/selectAll';
import toggleSelected from 'Utilities/Table/toggleSelected';
import { align, icons, sizes, tooltipPositions } from 'Helpers/Props';
import HeartRating from 'Components/HeartRating';
import Icon from 'Components/Icon';
import IconButton from 'Components/Link/IconButton';
import Label from 'Components/Label';
import LoadingIndicator from 'Components/Loading/LoadingIndicator';
import PageContent from 'Components/Page/PageContent';
import PageContentBody from 'Components/Page/PageContentBody';
import PageToolbar from 'Components/Page/Toolbar/PageToolbar';
import PageToolbarSection from 'Components/Page/Toolbar/PageToolbarSection';
import PageToolbarSeparator from 'Components/Page/Toolbar/PageToolbarSeparator';
import PageToolbarButton from 'Components/Page/Toolbar/PageToolbarButton';
import Popover from 'Components/Tooltip/Popover';
import Tooltip from 'Components/Tooltip/Tooltip';
import EpisodeFileEditorModal from 'EpisodeFile/Editor/EpisodeFileEditorModal';
import OrganizePreviewModalConnector from 'Organize/OrganizePreviewModalConnector';
import QualityProfileNameConnector from 'Settings/Profiles/Quality/QualityProfileNameConnector';
import SeriesPoster from 'Series/SeriesPoster';
import EditSeriesModalConnector from 'Series/Edit/EditSeriesModalConnector';
import DeleteSeriesModal from 'Series/Delete/DeleteSeriesModal';
import SeriesAlternateTitles from './SeriesAlternateTitles';
import SeriesDetailsSeasonConnector from './SeriesDetailsSeasonConnector';
import SeriesTagsConnector from './SeriesTagsConnector';
import SeriesDetailsLinks from './SeriesDetailsLinks';
import styles from './SeriesDetails.css';

function getFanartUrl(images) {
  const fanartImage = _.find(images, { coverType: 'fanart' });
  if (fanartImage) {
    // Remove protocol
    return fanartImage.url.replace(/^https?:/, '');
  }
}

function getExpandedState(newState) {
  return {
    allExpanded: newState.allSelected,
    allCollapsed: newState.allUnselected,
    expandedState: newState.selectedState
  };
}

class SeriesDetails extends Component {

  //
  // Lifecycle

  constructor(props, context) {
    super(props, context);

    this.state = {
      isOrganizeModalOpen: false,
      isManageEpisodesOpen: false,
      isEditSeriesModalOpen: false,
      isDeleteSeriesModalOpen: false,
      allExpanded: false,
      allCollapsed: false,
      expandedState: {}
    };
  }

  //
  // Listeners

  onOrganizePress = () => {
    this.setState({ isOrganizeModalOpen: true });
  }

  onOrganizeModalClose = () => {
    this.setState({ isOrganizeModalOpen: false });
  }

  onManageEpisodesPress = () => {
    this.setState({ isManageEpisodesOpen: true });
  }

  onManageEpisodesModalClose = () => {
    this.setState({ isManageEpisodesOpen: false });
  }

  onEditSeriesPress = () => {
    this.setState({ isEditSeriesModalOpen: true });
  }

  onEditSeriesModalClose = () => {
    this.setState({ isEditSeriesModalOpen: false });
  }

  onDeleteSeriesPress = () => {
    this.setState({
      isEditSeriesModalOpen: false,
      isDeleteSeriesModalOpen: true
    });
  }

  onDeleteSeriesModalClose = () => {
    this.setState({ isDeleteSeriesModalOpen: false });
  }

  onExpandAllPress = () => {
    const {
      allExpanded,
      expandedState
    } = this.state;

    this.setState(getExpandedState(selectAll(expandedState, !allExpanded)));
  }

  onExpandPress = (seasonNumber, isExpanded) => {
    this.setState((state) => {
      const convertedState = {
        allSelected: state.allExpanded,
        allUnselected: state.allCollapsed,
        selectedState: state.expandedState
      };

      const newState = toggleSelected(convertedState, [], seasonNumber, isExpanded, false);

      return getExpandedState(newState);
    });
  }

  //
  // Render

  render() {
    const {
      id,
      tvdbId,
      tvMazeId,
      tvRageId,
      imdbId,
      title,
      runtime,
      ratings,
      sizeOnDisk,
      episodeFilesCount,
      qualityProfileId,
      monitored,
      status,
      network,
      overview,
      images,
      seasons,
      alternateTitles,
      tags,
      isRefreshing,
      isSearching,
      isFetching,
      isPopulated,
      episodesError,
      episodeFilesError,
      previousSeries,
      nextSeries,
      onRefreshPress,
      onSearchPress
    } = this.props;

    const {
      isOrganizeModalOpen,
      isManageEpisodesOpen,
      isEditSeriesModalOpen,
      isDeleteSeriesModalOpen,
      allExpanded,
      allCollapsed,
      expandedState
    } = this.state;

    const continuing = status === 'continuing';

    let episodeFilesCountMessage = 'No episode files';

    if (episodeFilesCount === 1) {
      episodeFilesCountMessage = '1 episode file';
    } else if (episodeFilesCount > 1) {
      episodeFilesCountMessage = `${episodeFilesCount} episode files`;
    }

    let expandIcon = icons.EXPAND_INDETERMINATE;

    if (allExpanded) {
      expandIcon = icons.COLLAPSE;
    } else if (allCollapsed) {
      expandIcon = icons.EXPAND;
    }

    return (
      <PageContent title={title}>
        <PageToolbar>
          <PageToolbarSection>
            <PageToolbarButton
              iconName={icons.REFRESH}
              spinningName={icons.REFRESH}
              title="Search for monitored episodes in this series"
              isSpinning={isRefreshing}
              onPress={onRefreshPress}
            />

            <PageToolbarButton
              iconName={icons.SEARCH}
              title="Search for monitored episodes in this series"
              isSpinning={isSearching}
              onPress={onSearchPress}
            />

            <PageToolbarSeparator />

            <PageToolbarButton
              iconName={icons.ORGANIZE}
              title="Preview rename for this series"
              onPress={this.onOrganizePress}
            />

            <PageToolbarButton
              iconName={icons.EPISODE_FILE}
              title="Manage episode files in this series"
              onPress={this.onManageEpisodesPress}
            />

            <PageToolbarSeparator />

            <PageToolbarButton
              iconName={icons.EDIT}
              title="Edit series"
              onPress={this.onEditSeriesPress}
            />

            <PageToolbarButton
              iconName={icons.DELETE}
              title="Delete series"
              onPress={this.onDeleteSeriesPress}
            />
          </PageToolbarSection>

          <PageToolbarSection align={align.RIGHT}>
            <PageToolbarButton
              iconName={expandIcon}
              title="Expand all seasons in this series"
              onPress={this.onExpandAllPress}
            />
          </PageToolbarSection>
        </PageToolbar>

        <PageContentBody innerClassName={styles.innerContentBody}>
          <div className={styles.header}>
            <div
              className={styles.backdrop}
              style={{
                backgroundImage: `url(${getFanartUrl(images)})`
              }}
            >
              <div className={styles.backdropOverlay} />
            </div>

            <div className={styles.headerContent}>
              <SeriesPoster
                className={styles.poster}
                images={images}
                size={500}
                lazy={false}
              />

              <div className={styles.info}>
                <div className={styles.titleContainer}>
                  <div className={styles.title}>
                    {title}

                    {
                      !!alternateTitles.length &&
                        <span className={styles.alternateTitlesIconContainer}>
                          <Popover
                            anchor={
                              <Icon
                                name={icons.ALTERNATE_TITLES}
                                size={20}
                              />
                            }
                            title="Alternate Titles"
                            body={<SeriesAlternateTitles alternateTitles={alternateTitles} />}
                            position={tooltipPositions.BOTTOM}
                          />
                        </span>
                    }
                  </div>

                  <div className={styles.seriesNavigationButtons}>
                    <IconButton
                      className={styles.seriesNavigationButton}
                      name={icons.ARROW_LEFT}
                      size={30}
                      title={`Go to ${previousSeries.title}`}
                      to={`/series/${previousSeries.titleSlug}`}
                    />

                    <IconButton
                      className={styles.seriesNavigationButton}
                      name={icons.ARROW_RIGHT}
                      size={30}
                      title={`Go to ${nextSeries.title}`}
                      to={`/series/${nextSeries.titleSlug}`}
                    />
                  </div>
                </div>

                <div className={styles.details}>
                  <div>
                    {
                      !!runtime &&
                        <span className={styles.runtime}>
                          {runtime} Minutes
                        </span>
                    }

                    <HeartRating
                      rating={ratings.value}
                      iconSize={20}
                    />
                  </div>
                </div>

                <div className={styles.detailsLabels}>
                  <Label
                    className={styles.detailsLabel}
                    title={episodeFilesCountMessage}
                    size={sizes.LARGE}
                  >
                    <Icon
                      name={icons.DRIVE}
                      size={17}
                    />

                    <span className={styles.sizeOnDisk}>
                      {
                        formatBytes(sizeOnDisk)
                      }
                    </span>
                  </Label>

                  <Label
                    className={styles.detailsLabel}
                    title="Quality Profile"
                    size={sizes.LARGE}
                  >
                    <Icon
                      name={icons.PROFILE}
                      size={17}
                    />

                    <span className={styles.qualityProfileName}>
                      {
                        <QualityProfileNameConnector
                          qualityProfileId={qualityProfileId}
                        />
                      }
                    </span>
                  </Label>

                  <Label
                    className={styles.detailsLabel}
                    size={sizes.LARGE}
                  >
                    <Icon
                      name={monitored ? icons.MONITORED : icons.UNMONITORED}
                      size={17}
                    />

                    <span className={styles.qualityProfileName}>
                      {monitored ? 'Monitored' : 'Unmonitored'}
                    </span>
                  </Label>

                  <Label
                    className={styles.detailsLabel}
                    title={continuing ? 'More episodes/another season is expected' : 'No additional episodes or or another season is expected'}
                    size={sizes.LARGE}
                  >
                    <Icon
                      name={continuing ? icons.SERIES_CONTINUING : icons.SERIES_ENDED}
                      size={17}
                    />

                    <span className={styles.qualityProfileName}>
                      {continuing ? 'Continuing' : 'Ended'}
                    </span>
                  </Label>

                  <Label
                    className={styles.detailsLabel}
                    title="Network"
                    size={sizes.LARGE}
                  >
                    <Icon
                      name={icons.NETWORK}
                      size={17}
                    />

                    <span className={styles.qualityProfileName}>
                      {network}
                    </span>
                  </Label>

                  <Tooltip
                    anchor={
                      <Label
                        className={styles.detailsLabel}
                        size={sizes.LARGE}
                      >
                        <Icon
                          name={icons.EXTERNAL_LINK}
                          size={17}
                        />

                        <span className={styles.links}>
                          Links
                        </span>
                      </Label>
                    }
                    tooltip={
                      <SeriesDetailsLinks
                        tvdbId={tvdbId}
                        tvMazeId={tvMazeId}
                        tvRageId={tvRageId}
                        imdbId={imdbId}
                      />
                      }
                    position={tooltipPositions.BOTTOM}
                  />

                  {
                    !!tags.length &&
                      <Tooltip
                        anchor={
                          <Label
                            className={styles.detailsLabel}
                            size={sizes.LARGE}
                          >
                            <Icon
                              name={icons.TAGS}
                              size={17}
                            />

                            <span className={styles.tags}>
                              Tags
                            </span>
                          </Label>
                        }
                        tooltip={<SeriesTagsConnector seriesId={id} />}
                        position={tooltipPositions.BOTTOM}
                      />

                  }
                </div>

                <div>
                  {overview}
                </div>
              </div>
            </div>
          </div>

          <div className={styles.contentContainer}>
            {
              !isPopulated && !episodesError && !episodeFilesError &&
                <LoadingIndicator />
            }

            {
              !isFetching && episodesError &&
                <div>Loading episodes Failed</div>
            }

            {
              !isFetching && episodeFilesError &&
                <div>Loading episode files failed</div>
            }

            {
              isPopulated &&
                <div>
                  {
                    seasons.slice(0).reverse().map((season) => {
                      return (
                        <SeriesDetailsSeasonConnector
                          key={season.seasonNumber}
                          seriesId={id}
                          {...season}
                          isExpanded={expandedState[season.seasonNumber]}
                          onExpandPress={this.onExpandPress}
                        />
                      );
                    })
                  }
                </div>
            }

          </div>

          <OrganizePreviewModalConnector
            isOpen={isOrganizeModalOpen}
            seriesId={id}
            onModalClose={this.onOrganizeModalClose}
          />

          <EpisodeFileEditorModal
            isOpen={isManageEpisodesOpen}
            seriesId={id}
            onModalClose={this.onManageEpisodesModalClose}
          />

          <EditSeriesModalConnector
            isOpen={isEditSeriesModalOpen}
            seriesId={id}
            onModalClose={this.onEditSeriesModalClose}
            onDeleteSeriesPress={this.onDeleteSeriesPress}
          />

          <DeleteSeriesModal
            isOpen={isDeleteSeriesModalOpen}
            seriesId={id}
            onModalClose={this.onDeleteSeriesModalClose}
          />
        </PageContentBody>
      </PageContent>
    );
  }
}

SeriesDetails.propTypes = {
  id: PropTypes.number.isRequired,
  tvdbId: PropTypes.number.isRequired,
  tvMazeId: PropTypes.number,
  tvRageId: PropTypes.number,
  imdbId: PropTypes.string,
  title: PropTypes.string.isRequired,
  runtime: PropTypes.number.isRequired,
  ratings: PropTypes.object.isRequired,
  sizeOnDisk: PropTypes.number.isRequired,
  episodeFilesCount: PropTypes.number,
  qualityProfileId: PropTypes.number.isRequired,
  monitored: PropTypes.bool.isRequired,
  status: PropTypes.string.isRequired,
  network: PropTypes.string,
  overview: PropTypes.string.isRequired,
  images: PropTypes.arrayOf(PropTypes.object).isRequired,
  seasons: PropTypes.arrayOf(PropTypes.object).isRequired,
  alternateTitles: PropTypes.arrayOf(PropTypes.string).isRequired,
  tags: PropTypes.arrayOf(PropTypes.number).isRequired,
  isRefreshing: PropTypes.bool.isRequired,
  isSearching: PropTypes.bool.isRequired,
  isFetching: PropTypes.bool.isRequired,
  isPopulated: PropTypes.bool.isRequired,
  episodesError: PropTypes.object,
  episodeFilesError: PropTypes.object,
  previousSeries: PropTypes.object.isRequired,
  nextSeries: PropTypes.object.isRequired,
  onRefreshPress: PropTypes.func.isRequired,
  onSearchPress: PropTypes.func.isRequired
};

export default SeriesDetails;
