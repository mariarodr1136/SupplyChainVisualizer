import { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Form, Alert } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';
import PageHeader from '../components/common/PageHeader';
import './Settings.css';

const STORAGE_KEY = 'nexus-settings';

const DEFAULT_SETTINGS = {
  lowStockAlerts: true,
  shipmentDelayAlerts: true,
  weeklySummaryEmail: false,
  compactTables: false,
  distanceUnit: 'km',
};

const loadSettings = () => {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return stored ? { ...DEFAULT_SETTINGS, ...stored } : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
};

const Settings = () => {
  const { currentUser } = useContext(AuthContext);
  const [settings, setSettings] = useState(loadSettings);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    setSaved(true);
    const timer = setTimeout(() => setSaved(false), 1500);
    return () => clearTimeout(timer);
  }, [settings]);

  const toggle = (key) => setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  const setUnit = (distanceUnit) => setSettings((prev) => ({ ...prev, distanceUnit }));

  const isGuest = currentUser?.isGuest;

  return (
    <Container className="settings-page">
      <PageHeader title="Settings" subtitle="Preferences for this browser — stored locally" />

      {isGuest && (
        <Alert variant="info" className="guest-mode-alert">
          You&rsquo;re browsing in guest mode. Preferences are saved to this browser only and
          won&rsquo;t follow you to a registered account.
        </Alert>
      )}

      <Row>
        <Col lg={8}>
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">Notifications</h5>
            </Card.Header>
            <Card.Body>
              <Form.Check
                type="switch"
                id="lowStockAlerts"
                className="settings-switch"
                label="Low stock alerts"
                checked={settings.lowStockAlerts}
                onChange={() => toggle('lowStockAlerts')}
              />
              <p className="settings-hint">Notify when inventory drops to or below its reorder threshold.</p>

              <Form.Check
                type="switch"
                id="shipmentDelayAlerts"
                className="settings-switch"
                label="Shipment delay alerts"
                checked={settings.shipmentDelayAlerts}
                onChange={() => toggle('shipmentDelayAlerts')}
              />
              <p className="settings-hint">Notify when a shipment&rsquo;s status changes to delayed.</p>

              <Form.Check
                type="switch"
                id="weeklySummaryEmail"
                className="settings-switch"
                label="Weekly summary email"
                checked={settings.weeklySummaryEmail}
                onChange={() => toggle('weeklySummaryEmail')}
              />
              <p className="settings-hint mb-0">Send a weekly digest of network activity and KPIs.</p>
            </Card.Body>
          </Card>

          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">Display</h5>
            </Card.Header>
            <Card.Body>
              <Form.Check
                type="switch"
                id="compactTables"
                className="settings-switch"
                label="Compact tables"
                checked={settings.compactTables}
                onChange={() => toggle('compactTables')}
              />
              <p className="settings-hint">Reduce row padding on data tables to fit more rows on screen.</p>

              <Form.Group>
                <Form.Label>Distance unit</Form.Label>
                <div className="d-flex gap-3">
                  <Form.Check
                    type="radio"
                    id="unit-km"
                    name="distanceUnit"
                    label="Kilometers"
                    checked={settings.distanceUnit === 'km'}
                    onChange={() => setUnit('km')}
                  />
                  <Form.Check
                    type="radio"
                    id="unit-mi"
                    name="distanceUnit"
                    label="Miles"
                    checked={settings.distanceUnit === 'mi'}
                    onChange={() => setUnit('mi')}
                  />
                </div>
              </Form.Group>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card>
            <Card.Body>
              <h6 className="mb-2">Status</h6>
              <p className="text-muted small mb-0">
                {saved ? 'Saved to this browser.' : 'All changes save automatically.'}
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Settings;
