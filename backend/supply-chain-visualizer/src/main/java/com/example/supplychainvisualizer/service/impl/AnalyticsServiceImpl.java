package com.example.supplychainvisualizer.service.impl;

import com.example.supplychainvisualizer.dto.AnalyticsSummaryDto;
import com.example.supplychainvisualizer.model.Shipment;
import com.example.supplychainvisualizer.repository.ShipmentRepository;
import com.example.supplychainvisualizer.service.AnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AnalyticsServiceImpl implements AnalyticsService {

    @Autowired
    private ShipmentRepository shipmentRepository;

    @Override
    public AnalyticsSummaryDto getSummary() {
        List<Shipment> all = shipmentRepository.findAll();

        List<Shipment> delivered = all.stream()
                .filter(s -> "delivered".equalsIgnoreCase(s.getStatus()))
                .collect(Collectors.toList());

        List<Shipment> delayed = all.stream()
                .filter(s -> "delayed".equalsIgnoreCase(s.getStatus()))
                .collect(Collectors.toList());

        long onTimeCount = delivered.stream()
                .filter(s -> s.getActualArrival() != null && s.getEstimatedArrival() != null
                        && !s.getActualArrival().isAfter(s.getEstimatedArrival()))
                .count();

        double onTimeRate = delivered.isEmpty() ? 0
                : round1((double) onTimeCount / delivered.size() * 100);

        OptionalDouble avgLeadTimeOpt = delivered.stream()
                .filter(s -> s.getActualArrival() != null && s.getDepartureDate() != null)
                .mapToLong(s -> ChronoUnit.DAYS.between(s.getDepartureDate(), s.getActualArrival()))
                .average();

        double exceptionRate = all.isEmpty() ? 0
                : round1((double) delayed.size() / all.size() * 100);

        List<AnalyticsSummaryDto.LaneSlaDto> slaByLane = computeSlaByLane(delivered);
        List<AnalyticsSummaryDto.SegmentLeadTimeDto> leadTimeBySegment = computeLeadTimeBySegment(delivered);

        AnalyticsSummaryDto dto = new AnalyticsSummaryDto();
        dto.setOnTimeDeliveryRate(onTimeRate);
        dto.setAvgLeadTimeDays(round1(avgLeadTimeOpt.orElse(0)));
        dto.setExceptionRate(exceptionRate);
        dto.setTotalShipments(all.size());
        dto.setDeliveredShipments(delivered.size());
        dto.setSlaByLane(slaByLane);
        dto.setLeadTimeBySegment(leadTimeBySegment);
        return dto;
    }

    private List<AnalyticsSummaryDto.LaneSlaDto> computeSlaByLane(List<Shipment> delivered) {
        Map<String, long[]> laneMap = new LinkedHashMap<>();
        for (Shipment s : delivered) {
            String lane = s.getSource().getName() + " → " + s.getDestination().getName();
            laneMap.computeIfAbsent(lane, k -> new long[]{0, 0});
            laneMap.get(lane)[0]++;
            if (s.getActualArrival() != null && s.getEstimatedArrival() != null
                    && !s.getActualArrival().isAfter(s.getEstimatedArrival())) {
                laneMap.get(lane)[1]++;
            }
        }
        return laneMap.entrySet().stream()
                .map(e -> {
                    double rate = e.getValue()[0] == 0 ? 0
                            : round1((double) e.getValue()[1] / e.getValue()[0] * 100);
                    return new AnalyticsSummaryDto.LaneSlaDto(e.getKey(), rate);
                })
                .collect(Collectors.toList());
    }

    private List<AnalyticsSummaryDto.SegmentLeadTimeDto> computeLeadTimeBySegment(List<Shipment> delivered) {
        Map<String, List<long[]>> segmentMap = new LinkedHashMap<>();
        for (Shipment s : delivered) {
            if (s.getDepartureDate() == null || s.getEstimatedArrival() == null || s.getActualArrival() == null) {
                continue;
            }
            String srcType = capitalize(s.getSource().getType());
            String dstType = capitalize(s.getDestination().getType());
            String segment = srcType + " → " + dstType;
            long target = ChronoUnit.DAYS.between(s.getDepartureDate(), s.getEstimatedArrival());
            long actual = ChronoUnit.DAYS.between(s.getDepartureDate(), s.getActualArrival());
            segmentMap.computeIfAbsent(segment, k -> new ArrayList<>()).add(new long[]{target, actual});
        }
        return segmentMap.entrySet().stream()
                .map(e -> {
                    double avgTarget = e.getValue().stream().mapToLong(a -> a[0]).average().orElse(0);
                    double avgActual = e.getValue().stream().mapToLong(a -> a[1]).average().orElse(0);
                    double variance = avgActual - avgTarget;
                    String varianceStr = (variance >= 0 ? "+" : "") + String.format("%.1f", variance);
                    return new AnalyticsSummaryDto.SegmentLeadTimeDto(
                            e.getKey(), round1(avgTarget), round1(avgActual), varianceStr);
                })
                .collect(Collectors.toList());
    }

    private static double round1(double v) {
        return Math.round(v * 10.0) / 10.0;
    }

    private static String capitalize(String s) {
        if (s == null || s.isEmpty()) return s;
        return Character.toUpperCase(s.charAt(0)) + s.substring(1);
    }
}
