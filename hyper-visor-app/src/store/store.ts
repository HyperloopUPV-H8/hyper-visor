import { create } from "zustand";
import type { Board, BoardId, Measurement, MeasurementId, Packet, PacketId } from "../types/adj";

interface Store {
    boards: Map<BoardId, Board>;
    packets: Map<PacketId, Packet>;
    measurements: Map<MeasurementId, Measurement>;
}

const useADJStore = create<Store>((set, get) => ({
    boards: new Map(),
    packets: new Map(),
    measurements: new Map(),

    initADJ: (adj: Store) => {
        set({
            ...get(),
            boards: adj.boards,
            packets: adj.packets,
            measurements: adj.measurements
        });
    }
}))

export default useADJStore;