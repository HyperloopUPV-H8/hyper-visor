import { create } from "zustand";
import type { Board, BoardId, Measurement, MeasurementId, Packet, PacketId } from "../types/adj";
import type { MeasurementValue, PacketUpdate } from "../types/adj/api/packet-update.interface";

export interface InitADJPacket {
    boards: Record<BoardId, Board>;
    packets: Record<PacketId, Packet>;
    measurements: Record<MeasurementId, Measurement>;
}

interface Store {
    boards: Record<BoardId, Board>;
    packets: Record<PacketId, Packet>;
    measurements: Record<MeasurementId, Measurement>;
    metricsUpdates: Record<MeasurementId, MeasurementValue>;
    updateMetricsFromPacketUpdate: (packetUpdate: PacketUpdate) => void;
    initADJFromPacket: (packet: InitADJPacket) => void;
}

const useADJStore = create<Store>((set, get) => ({
    boards: {},
    packets: {},
    measurements: {},
    metricsUpdates: {},

    initADJFromPacket: (packet: InitADJPacket) => {
        const newMeasurements: Record<MeasurementId, Measurement> = {};

        Object.keys(packet.measurements).forEach((measurementId) => {
            newMeasurements[measurementId] = packet.measurements[measurementId];
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
            const newMetricsUpdates: Record<MeasurementId, MeasurementValue> = {};
            packetUpdate.measurements.forEach((measurement) => {
                newMetricsUpdates[measurement.measurementId] = measurement.value;
            });
            return {
                ...state,
                metricsUpdates: newMetricsUpdates
            };
        });
    }
}))

export default useADJStore;