import { useHyperloopSocket } from '../api/useWebsocket';
import useADJStore, { type InitADJPacket } from '../store/store';
import type { PacketUpdate } from '../types/adj/api/packet-update.interface';

export const useHyperloopSocketManager = () => {

    const WEBSOCKET_URL = import.meta.env.VITE_BACKEND_URL
    const WEBSOCKET_PORT = import.meta.env.VITE_BACKEND_PORT

    const initADJFromPacket = useADJStore((state) => state.initADJFromPacket);
    const updateMetricsFromPacketUpdate = useADJStore((state) => state.updateMetricsFromPacketUpdate);

    const { readyState } = useHyperloopSocket({
        url: `ws://${WEBSOCKET_URL}:${WEBSOCKET_PORT}`,
        onFirstMessage: (data: InitADJPacket) => {
            initADJFromPacket(data);
        },
        onUpdateMessage: (data: PacketUpdate) => {
            updateMetricsFromPacketUpdate(data);
        }
    });

    return { readyState };
}
