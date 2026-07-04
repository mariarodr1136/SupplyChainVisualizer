import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { FaExclamationTriangle } from 'react-icons/fa';

const DeleteConfirmModal = ({ show, onHide, onConfirm, title, message }) => {
  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton>
        <Modal.Title className="text-danger">
          <FaExclamationTriangle className="me-2" />
          {title || 'Confirm Deletion'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{message || 'Are you sure you want to delete this item? This action cannot be undone.'}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteConfirmModal;