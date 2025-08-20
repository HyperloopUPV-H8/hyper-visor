import { create } from "zustand";
import type { Board, BoardId, Measurement, MeasurementId, Packet, PacketId } from "../types/adj";

type MetricValue = number | string | boolean;

interface Store {
    boards: Map<BoardId, Board>;
    packets: Map<PacketId, Packet>;
    measurements: Map<MeasurementId, Measurement>;
    metricsUpdates: Map<MeasurementId, MetricValue>;
    updateMetric: (measurementId: MeasurementId, value: MetricValue) => void;
    initADJ: (adj: Store) => void;
}

const useADJStore = create<Store>((set, get) => ({
    boards: new Map(),
    packets: new Map(),
    measurements: new Map(),
    metricsUpdates: new Map(),

    initADJ: (adj: Store) => {
        set({
            ...get(),
            boards: adj.boards,
            packets: adj.packets,
            measurements: adj.measurements
        });
    },

    updateMetric: (measurementId: MeasurementId, value: MetricValue) => {
        set((state) => {
            const newMetricsUpdates = new Map(state.metricsUpdates);
            newMetricsUpdates.set(measurementId, value);
            return {
                ...state,
                metricsUpdates: newMetricsUpdates
            };
        });
    }
}))

export default useADJStore;