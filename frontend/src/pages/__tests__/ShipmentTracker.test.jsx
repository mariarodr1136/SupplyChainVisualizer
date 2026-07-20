import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, beforeEach } from 'vitest';
import ShipmentTracker from '../ShipmentTracker';

const renderTracker = () =>
  render(
    <MemoryRouter>
      <ShipmentTracker />
    </MemoryRouter>
  );

describe('ShipmentTracker in guest mode', () => {
  beforeEach(() => {
    localStorage.setItem('user', JSON.stringify({ username: 'Guest', isGuest: true }));
  });

  it('renders the page header and shipment rows from guest data', async () => {
    renderTracker();

    expect(await screen.findByText('Shipment Tracker')).toBeInTheDocument();
    // Node names resolved from guest data appear once shipments load
    const matches = await screen.findAllByText(/Pacific Components Factory|Central Warehouse/);
    expect(matches.length).toBeGreaterThan(0);
  });

  it('shows shipment status badges', async () => {
    renderTracker();

    const inTransit = await screen.findAllByText(/in.?transit/i);
    expect(inTransit.length).toBeGreaterThan(0);
  });
});
