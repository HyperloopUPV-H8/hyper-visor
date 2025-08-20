import { create } from "zustand";
import type { Board, BoardId, Measurement, MeasurementId, Packet, PacketId } from "../types/adj";
import type { MeasurementValue, PacketUpdate } from "../types/adj/api/packet-update.interface";

export interface InitADJPacket {
    boards: Map<BoardId, Board>;
    packets: Map<PacketId, Packet>;
    measurements: Map<MeasurementId, Measurement>;
}

interface Store {
    boards: Map<BoardId, Board>;
    packets: Map<PacketId, Packet>;
    measurements: Map<MeasurementId, Measurement>;
    metricsUpdates: Map<MeasurementId, MeasurementValue>;
    updateMetricsFromPacketUpdate: (packetUpdate: PacketUpdate) => void;
    initADJFromPacket: (packet: InitADJPacket) => void;
}

const useADJStore = create<Store>((set, get) => ({
    boards: new Map(),
    packets: new Map(),
    measurements: new Map(),
    metricsUpdates: new Map(),

    initADJFromPacket: (packet: InitADJPacket) => {
        const newMeasurements = new Map();

        packet.measurements.forEach((measurement) => {
            newMeasurements.set(measurement.id, measurement);
        });

        set({
            ...get(),
            boards: packet.boards,
            packets: packet.packets,
            measurements: newMeasurements
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