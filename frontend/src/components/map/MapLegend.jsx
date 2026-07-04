import React from 'react';
import { Card } from 'react-bootstrap';
import { 
  FaIndustry, 
  FaWarehouse, 
  FaStore, 
  FaTruckLoading,
  FaArrowRight
} from 'react-icons/fa';
import './MapLegend.css';

const MapLegend = ({ viewMode }) => {
  const renderLegendItems = () => {
    if (viewMode === 'risk') {
      return (
        <>
          <div className="legend-item">
            <div className="legend-color risk-low"></div>
            <span>Low Risk</span>
          </div>
          <div className="legend-item">
            <div className="legend-color risk-medium"></div>
            <span>Medium Risk</span>
          </div>
          <div className="legend-item">
            <div className="legend-color risk-high"></div>
            <span>High Risk</span>
          </div>
          <div className="legend-divider"></div>
          <div className="legend-item">
            <div className="legend-line risk-low-line"></div>
            <span>Low Risk Route</span>
          </div>
          <div className="legend-item">
            <div className="legend-line risk-medium-line"></div>
            <span>Medium Risk Route</span>
          </div>
          <div className="legend-item">
            <div className="legend-line risk-high-line"></div>
            <span>High Risk Route</span>
          </div>
        </>
      );
    } else if (viewMode === 'performance') {
      return (
        <>
          <div className="legend-item">
            <div className="legend-color performance-high"></div>
            <span>High Performance</span>
          </div>
          <div className="legend-item">
            <div className="legend-color performance-medium"></div>
            <span>Medium Performance</span>
          </div>
          <div className="legend-item">
            <div className="legend-color performance-low"></div>
            <span>Low Performance</span>
          </div>
          <div className="legend-divider"></div>
          <div className="legend-item">
            <div className="legend-line performance-high-line"></div>
            <span>High Performance Route</span>
          </div>
          <div className="legend-item">
            <div className="legend-line performance-medium-line"></div>
            <span>Medium Performance Route</span>
          </div>
          <div className="legend-item">
            <div className="legend-line performance-low-line"></div>
            <span>Low Performance Route</span>
          </div>
        </>
      );
    } else {
      return (
        <>
          <div className="legend-item">
            <div className="legend-icon factory-icon">
              <FaIndustry />
            </div>
            <span>Factory</span>
          </div>
          <div className="legend-item">
            <div className="legend-icon warehouse-icon">
              <FaWarehouse />
            </div>
            <span>Warehouse</span>
          </div>
          <div className="legend-item">
            <div className="legend-icon store-icon">
              <FaStore />
            </div>
            <span>Store</span>
          </div>
          <div className="legend-item">
            <div className="legend-icon supplier-icon">
              <FaTruckLoading />
            </div>
            <span>Supplier</span>
          </div>
          <div className="legend-divider"></div>
          <div className="legend-item">
            <div className="legend-line normal-line"></div>
            <span>Normal Route</span>
          </div>
          <div className="legend-item">
            <div className="legend-line delayed-line"></div>
            <span>Delayed</span>
          </div>
          <div className="legend-item">
            <div className="legend-line capacity-line"></div>
            <span>At Capacity</span>
          </div>
        </>
      );
    }
  };

  return (
    <Card className="map-legend">
      <Card.Body>
        <h6 className="legend-title">Legend</h6>
        <div className="legend-items">
          {renderLegendItems()}
        </div>
      </Card.Body>
    </Card>
  );
};

export default MapLegend;