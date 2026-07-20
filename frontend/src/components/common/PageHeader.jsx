import { Button } from 'react-bootstrap';
import './PageHeader.css';

const PageHeader = ({ title, subtitle, buttonText, buttonIcon, onButtonClick, children }) => {
  return (
    <div className="page-header-row">
      <div>
        <h1 className="page-title">{title}</h1>
        {subtitle && <p className="page-title-sub">{subtitle}</p>}
      </div>
      <div className="page-header-actions">
        {children}
        {buttonText && (
          <Button variant="primary" onClick={onButtonClick}>
            {buttonIcon && <span className="me-2">{buttonIcon}</span>}
            {buttonText}
          </Button>
        )}
      </div>
    </div>
  );
};

export default PageHeader;
