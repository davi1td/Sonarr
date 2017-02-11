import React, { PropTypes } from 'react';
import Label from 'Components/Label';

function EpisodeLanguage(props) {
  const language = props.language;

  if (!language) {
    return null;
  }

  return (
    <Label>
      {language.name}
    </Label>
  );
}

EpisodeLanguage.propTypes = {
  language: PropTypes.object
};

export default EpisodeLanguage;
