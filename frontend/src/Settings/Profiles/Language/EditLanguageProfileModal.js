import React, { PropTypes } from 'react';
import Modal from 'Components/Modal/Modal';
import EditLanguageProfileModalContentConnector from './EditLanguageProfileModalContentConnector';

function EditLanguageProfileModal({ isOpen, onModalClose, ...otherProps }) {
  return (
    <Modal
      isOpen={isOpen}
      onModalClose={onModalClose}
    >
      <EditLanguageProfileModalContentConnector
        {...otherProps}
        onModalClose={onModalClose}
      />
    </Modal>
  );
}

EditLanguageProfileModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onModalClose: PropTypes.func.isRequired
};

export default EditLanguageProfileModal;
