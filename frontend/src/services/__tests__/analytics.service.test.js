import { describe, it, expect, beforeEach } from 'vitest';
import AnalyticsService from '../analytics.service';
import { guestDataApi } from '../../data/guestData';

describe('AnalyticsService guest summary', () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('user', JSON.stringify({ isGuest: true }));
  });

  it('computes KPI fields from guest shipment data', async () => {
    const { data } = await AnalyticsService.getSummary();
    const shipments = guestDataApi.getShipments();
    const delivered = shipments.filter((s) => s.status === 'delivered');

    expect(data.totalShipments).toBe(shipments.length);
    expect(data.deliveredShipments).toBe(delivered.length);
    expect(typeof data.onTimeDeliveryRate).toBe('number');
    expect(typeof data.avgLeadTimeDays).toBe('number');
    expect(typeof data.exceptionRate).toBe('number');
    expect(Array.isArray(data.slaByLane)).toBe(true);
  });
});
