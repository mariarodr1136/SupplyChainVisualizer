package com.example.supplychainvisualizer.dto;

import java.util.List;

public class AnalyticsSummaryDto {

    private double onTimeDeliveryRate;
    private double avgLeadTimeDays;
    private double exceptionRate;
    private int totalShipments;
    private int deliveredShipments;
    private List<LaneSlaDto> slaByLane;
    private List<SegmentLeadTimeDto> leadTimeBySegment;

    public static class LaneSlaDto {
        private String lane;
        private double slaRate;

        public LaneSlaDto(String lane, double slaRate) {
            this.lane = lane;
            this.slaRate = slaRate;
        }

        public String getLane() { return lane; }
        public double getSlaRate() { return slaRate; }
    }

    public static class SegmentLeadTimeDto {
        private String segment;
        private double targetDays;
        private double actualDays;
        private String variance;

        public SegmentLeadTimeDto(String segment, double targetDays, double actualDays, String variance) {
            this.segment = segment;
            this.targetDays = targetDays;
            this.actualDays = actualDays;
            this.variance = variance;
        }

        public String getSegment() { return segment; }
        public double getTargetDays() { return targetDays; }
        public double getActualDays() { return actualDays; }
        public String getVariance() { return variance; }
    }

    public double getOnTimeDeliveryRate() { return onTimeDeliveryRate; }
    public void setOnTimeDeliveryRate(double v) { this.onTimeDeliveryRate = v; }

    public double getAvgLeadTimeDays() { return avgLeadTimeDays; }
    public void setAvgLeadTimeDays(double v) { this.avgLeadTimeDays = v; }

    public double getExceptionRate() { return exceptionRate; }
    public void setExceptionRate(double v) { this.exceptionRate = v; }

    public int getTotalShipments() { return totalShipments; }
    public void setTotalShipments(int v) { this.totalShipments = v; }

    public int getDeliveredShipments() { return deliveredShipments; }
    public void setDeliveredShipments(int v) { this.deliveredShipments = v; }

    public List<LaneSlaDto> getSlaByLane() { return slaByLane; }
    public void setSlaByLane(List<LaneSlaDto> v) { this.slaByLane = v; }

    public List<SegmentLeadTimeDto> getLeadTimeBySegment() { return leadTimeBySegment; }
    public void setLeadTimeBySegment(List<SegmentLeadTimeDto> v) { this.leadTimeBySegment = v; }
}
