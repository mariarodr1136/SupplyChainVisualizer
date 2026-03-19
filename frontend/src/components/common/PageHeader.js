import React from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import './PageHeader.css';

const PageHeader = ({ title, buttonText, buttonIcon, onButtonClick, children }) => {
  return (
    <Row className="mb-4 align-items-center">
      <Col>
        <h1 className="h3 page-title">{title}</h1>
      </Col>
      {children && <Col xs="auto">{children}</Col>}
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
