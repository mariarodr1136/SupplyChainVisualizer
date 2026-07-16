import axios from 'axios';
import authHeader from './auth-header';
import { guestOr } from './guest-utils';
import { guestDataApi } from '../data/guestData';

const API_URL = (import.meta.env.VITE_API_URL || '') + '/api/analytics/';

const capitalize = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

const daysBetween = (start, end) => (new Date(end) - new Date(start)) / 86400000;

const computeLeadTimeBySegment = (delivered) => {
  const segmentMap = {};
  delivered.forEach((s) => {
    if (!s.departureDate || !s.estimatedArrival || !s.actualArrival) return;
    const sourceNode = guestDataApi.getNodeById(s.sourceId);
    const destinationNode = guestDataApi.getNodeById(s.destinationId);
    const segment = `${capitalize(sourceNode?.type)} → ${capitalize(destinationNode?.type)}`;
    const target = daysBetween(s.departureDate, s.estimatedArrival);
    const actual = daysBetween(s.departureDate, s.actualArrival);
    if (!segmentMap[segment]) segmentMap[segment] = [];
    segmentMap[segment].push({ target, actual });
  });

  return Object.entries(segmentMap).map(([segment, rows]) => {
    const avgTarget = rows.reduce((sum, r) => sum + r.target, 0) / rows.length;
    const avgActual = rows.reduce((sum, r) => sum + r.actual, 0) / rows.length;
    const variance = avgActual - avgTarget;
    return {
      segment,
      targetDays: Math.round(avgTarget * 10) / 10,
      actualDays: Math.round(avgActual * 10) / 10,
      variance: `${variance >= 0 ? '+' : ''}${variance.toFixed(1)}`,
    };
  });
};

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
    deliveredShipments: delivered.length,
    slaByLane,
    leadTimeBySegment: computeLeadTimeBySegment(delivered),
  };
};

class AnalyticsService {
  getSummary() {
    return guestOr(
      () => computeGuestSummary(),
      () => axios.get(API_URL + 'summary', { headers: authHeader() })
    );
  }
}

const analyticsService = new AnalyticsService();
export default analyticsService;
