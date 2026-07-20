import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import Dashboard from '../Dashboard';

// jsdom has no canvas; stub the chart components so the page can render
vi.mock('react-chartjs-2', () => ({
  Line: () => <div data-testid="line-chart" />,
  Doughnut: () => <div data-testid="doughnut-chart" />,
}));

const renderDashboard = () =>
  render(
    <MemoryRouter>
      <Dashboard />
    </MemoryRouter>
  );

describe('Dashboard in guest mode', () => {
  beforeEach(() => {
    localStorage.setItem('user', JSON.stringify({ username: 'Guest', isGuest: true }));
  });

  it('renders the stat cards from guest data', async () => {
    renderDashboard();

    expect(await screen.findByText('Active Locations')).toBeInTheDocument();
    expect(screen.getByText('In Transit Shipments')).toBeInTheDocument();
    expect(screen.getByText('Delivered Shipments')).toBeInTheDocument();
    expect(screen.getAllByText('Low Stock Alerts').length).toBeGreaterThan(0);
  });

  it('renders the chart sections once data has loaded', async () => {
    renderDashboard();

    expect(await screen.findByText('Shipment Trends (Last 6 Months)')).toBeInTheDocument();
    expect(screen.getByText('Network Overview')).toBeInTheDocument();
    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
  });
});
