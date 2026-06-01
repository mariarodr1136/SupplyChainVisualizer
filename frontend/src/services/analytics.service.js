import axios from 'axios';
import authHeader from './auth-header';
import { isGuestUser } from './guest-utils';
import { guestDataApi } from '../data/guestData';

const API_URL = (process.env.REACT_APP_API_URL || '') + '/api/analytics/';

const computeGuestSummary = () => {
  const shipments = guestDataApi.getShipments();
  const delivered = shipments.filter((s) => s.status === 'delivered');
  const delayed = shipments.filter((s) => s.status === 'delayed');

  const onTime = delivered.filter(
    (s) =>
      s.actualArrival &&
      s.estimatedArrival &&
      new Date(s.actualArrival) <= new Date(s.estimatedArrival)
  );
  const onTimeRate =
    delivered.length > 0
      ? Math.round((onTime.length / delivered.length) * 1000) / 10
      : 0;

  const leadTimes = delivered
    .filter((s) => s.actualArrival && s.departureDate)
    .map((s) => (new Date(s.actualArrival) - new Date(s.departureDate)) / 86400000);
  const avgLeadTime =
    leadTimes.length > 0
      ? Math.round((leadTimes.reduce((a, b) => a + b, 0) / leadTimes.length) * 10) / 10
      : 0;

  const exceptionRate =
    shipments.length > 0
      ? Math.round((delayed.length / shipments.length) * 1000) / 10
      : 0;

  const laneMap = {};
  delivered.forEach((s) => {
    const lane = `${s.sourceName} → ${s.destinationName}`;
    if (!laneMap[lane]) laneMap[lane] = { total: 0, onTime: 0 };
    laneMap[lane].total++;
    if (
      s.actualArrival &&
      s.estimatedArrival &&
      new Date(s.actualArrival) <= new Date(s.estimatedArrival)
    ) {
      laneMap[lane].onTime++;
    }
  });
  const slaByLane = Object.entries(laneMap).map(([lane, { total, onTime: ot }]) => ({
    lane,
    slaRate: total > 0 ? Math.round((ot / total) * 1000) / 10 : 0,
  }));

  return {
    onTimeDeliveryRate: onTimeRate,
    avgLeadTimeDays: avgLeadTime,
    exceptionRate,
    totalShipments: shipments.length,
    deliveredShipments: delivered.size,
    slaByLane,
    leadTimeBySegment: [],
  };
};

class AnalyticsService {
  getSummary() {
    if (isGuestUser()) {
      return Promise.resolve({ data: computeGuestSummary() });
    }
    return axios.get(API_URL + 'summary', { headers: authHeader() });
  }
}

const analyticsService = new AnalyticsService();
export default analyticsService;
