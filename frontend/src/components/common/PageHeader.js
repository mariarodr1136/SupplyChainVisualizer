import React from 'react';
import { Row, Col, Button } from 'react-bootstrap';

const PageHeader = ({ title, buttonText, buttonIcon, onButtonClick }) => {
  return (
    <Row className="mb-4 align-items-center">
      <Col>
        <h1 className="h3">{title}</h1>
      </Col>
      {buttonText && (
        <Col xs="auto">
          <Button 
            variant="primary" 
            onClick={onButtonClick}
          >
            {buttonIcon && <span className="me-2">{buttonIcon}</span>}
            {buttonText}
          </Button>
        </Col>
      )}
    </Row>
  );
};

export default PageHeader;