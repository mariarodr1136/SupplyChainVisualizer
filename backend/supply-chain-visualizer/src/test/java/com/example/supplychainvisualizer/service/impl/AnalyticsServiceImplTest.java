package com.example.supplychainvisualizer.service.impl;

import com.example.supplychainvisualizer.dto.AnalyticsSummaryDto;
import com.example.supplychainvisualizer.model.Node;
import com.example.supplychainvisualizer.model.Shipment;
import com.example.supplychainvisualizer.repository.ShipmentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AnalyticsServiceImplTest {

    @Mock
    private ShipmentRepository shipmentRepository;

    @InjectMocks
    private AnalyticsServiceImpl analyticsService;

    private Node factory;
    private Node warehouse;

    @BeforeEach
    void setUp() {
        factory = new Node();
        factory.setId(1L);
        factory.setName("Pacific Factory");
        factory.setType("factory");

        warehouse = new Node();
        warehouse.setId(2L);
        warehouse.setName("Central Warehouse");
        warehouse.setType("warehouse");
    }

    private Shipment deliveredOnTime(LocalDate departure, LocalDate estimated, LocalDate actual) {
        Shipment s = new Shipment();
        s.setSource(factory);
        s.setDestination(warehouse);
        s.setStatus("delivered");
        s.setDepartureDate(departure);
        s.setEstimatedArrival(estimated);
        s.setActualArrival(actual);
        return s;
    }

    private Shipment delayed() {
        Shipment s = new Shipment();
        s.setSource(factory);
        s.setDestination(warehouse);
        s.setStatus("delayed");
        return s;
    }

    @Test
    void getSummary_noShipments_returnsAllZeros() {
        when(shipmentRepository.findAll()).thenReturn(List.of());

        AnalyticsSummaryDto result = analyticsService.getSummary();

        assertThat(result.getTotalShipments()).isZero();
        assertThat(result.getDeliveredShipments()).isZero();
        assertThat(result.getOnTimeDeliveryRate()).isZero();
        assertThat(result.getAvgLeadTimeDays()).isZero();
        assertThat(result.getExceptionRate()).isZero();
        assertThat(result.getSlaByLane()).isEmpty();
        assertThat(result.getLeadTimeBySegment()).isEmpty();
    }

    @Test
    void getSummary_allOnTimeDeliveries_returns100Rate() {
        LocalDate dep = LocalDate.of(2026, 1, 1);
        LocalDate est = LocalDate.of(2026, 1, 5);
        LocalDate act = LocalDate.of(2026, 1, 4);

        Shipment s = deliveredOnTime(dep, est, act);
        when(shipmentRepository.findAll()).thenReturn(List.of(s));

        AnalyticsSummaryDto result = analyticsService.getSummary();

        assertThat(result.getOnTimeDeliveryRate()).isEqualTo(100.0);
        assertThat(result.getTotalShipments()).isEqualTo(1);
        assertThat(result.getDeliveredShipments()).isEqualTo(1);
        assertThat(result.getExceptionRate()).isZero();
    }

    @Test
    void getSummary_lateDelivery_returns0OnTimeRate() {
        LocalDate dep = LocalDate.of(2026, 1, 1);
        LocalDate est = LocalDate.of(2026, 1, 5);
        LocalDate act = LocalDate.of(2026, 1, 7);

        Shipment s = deliveredOnTime(dep, est, act);
        when(shipmentRepository.findAll()).thenReturn(List.of(s));

        AnalyticsSummaryDto result = analyticsService.getSummary();

        assertThat(result.getOnTimeDeliveryRate()).isZero();
        assertThat(result.getDeliveredShipments()).isEqualTo(1);
    }

    @Test
    void getSummary_withDelayedShipments_computesExceptionRate() {
        Shipment onTime = deliveredOnTime(
                LocalDate.of(2026, 1, 1), LocalDate.of(2026, 1, 5), LocalDate.of(2026, 1, 4));
        Shipment late = delayed();

        when(shipmentRepository.findAll()).thenReturn(List.of(onTime, late));

        AnalyticsSummaryDto result = analyticsService.getSummary();

        assertThat(result.getTotalShipments()).isEqualTo(2);
        assertThat(result.getExceptionRate()).isEqualTo(50.0);
    }

    @Test
    void getSummary_computesAvgLeadTime() {
        Shipment s1 = deliveredOnTime(
                LocalDate.of(2026, 1, 1), LocalDate.of(2026, 1, 5), LocalDate.of(2026, 1, 5));
        Shipment s2 = deliveredOnTime(
                LocalDate.of(2026, 1, 1), LocalDate.of(2026, 1, 9), LocalDate.of(2026, 1, 9));

        when(shipmentRepository.findAll()).thenReturn(List.of(s1, s2));

        AnalyticsSummaryDto result = analyticsService.getSummary();

        // lead times: 4 days and 8 days → avg = 6.0
        assertThat(result.getAvgLeadTimeDays()).isEqualTo(6.0);
    }

    @Test
    void getSummary_computesSlaByLane() {
        Shipment onTime = deliveredOnTime(
                LocalDate.of(2026, 1, 1), LocalDate.of(2026, 1, 5), LocalDate.of(2026, 1, 4));
        Shipment late = deliveredOnTime(
                LocalDate.of(2026, 1, 1), LocalDate.of(2026, 1, 5), LocalDate.of(2026, 1, 7));

        when(shipmentRepository.findAll()).thenReturn(List.of(onTime, late));

        AnalyticsSummaryDto result = analyticsService.getSummary();

        assertThat(result.getSlaByLane()).hasSize(1);
        AnalyticsSummaryDto.LaneSlaDto lane = result.getSlaByLane().get(0);
        assertThat(lane.getLane()).isEqualTo("Pacific Factory → Central Warehouse");
        assertThat(lane.getSlaRate()).isEqualTo(50.0);
    }

    @Test
    void getSummary_computesLeadTimeVarianceBySegment() {
        // target = 4 days, actual = 6 days → variance = +2.0
        Shipment s = deliveredOnTime(
                LocalDate.of(2026, 1, 1), LocalDate.of(2026, 1, 5), LocalDate.of(2026, 1, 7));

        when(shipmentRepository.findAll()).thenReturn(List.of(s));

        AnalyticsSummaryDto result = analyticsService.getSummary();

        assertThat(result.getLeadTimeBySegment()).hasSize(1);
        AnalyticsSummaryDto.SegmentLeadTimeDto seg = result.getLeadTimeBySegment().get(0);
        assertThat(seg.getSegment()).isEqualTo("Factory → Warehouse");
        assertThat(seg.getTargetDays()).isEqualTo(4.0);
        assertThat(seg.getActualDays()).isEqualTo(6.0);
        assertThat(seg.getVariance()).isEqualTo("+2.0");
    }

    @Test
    void getSummary_onlyDelayedShipments_onTimeRateIsZero() {
        Shipment late = delayed();
        when(shipmentRepository.findAll()).thenReturn(List.of(late));

        AnalyticsSummaryDto result = analyticsService.getSummary();

        assertThat(result.getOnTimeDeliveryRate()).isZero();
        assertThat(result.getDeliveredShipments()).isZero();
        assertThat(result.getExceptionRate()).isEqualTo(100.0);
    }
}
