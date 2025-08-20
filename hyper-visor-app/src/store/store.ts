import { create } from "zustand";
import type { Board, BoardId, Measurement, MeasurementId, Packet, PacketId } from "../types/adj";
import type { MeasurementValue, PacketUpdate } from "../types/adj/api/packet-update.interface";

interface Store {
    boards: Map<BoardId, Board>;
    packets: Map<PacketId, Packet>;
    measurements: Map<MeasurementId, Measurement>;
    metricsUpdates: Map<MeasurementId, MeasurementValue>;
    updateMetricsFromPacketUpdate: (packetUpdate: PacketUpdate) => void;
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

    updateMetricsFromPacketUpdate: (packetUpdate: PacketUpdate) => {
        set((state) => {
            const newMetricsUpdates = new Map(state.metricsUpdates);
            packetUpdate.measurements.forEach((measurement) => {
                newMetricsUpdates.set(measurement.measurementId, measurement.value);
            });
            return {
                ...state,
                metricsUpdates: newMetricsUpdates
            };
        });
    }
}))

export default useADJStore;