import { useHyperloopSocket } from '../api/useWebsocket';

export const useHyperloopSocketManager = () => {

    const WEBSOCKET_URL = import.meta.env.VITE_BACKEND_URL
    const WEBSOCKET_PORT = import.meta.env.VITE_BACKEND_PORT

    const { readyState } = useHyperloopSocket({
        url: `ws://${WEBSOCKET_URL}:${WEBSOCKET_PORT}`,
        onFirstMessage: (data) => {
            console.log('first message', data);
        },
        onUpdateMessage: (data) => {
            console.log('update message', data);
        }
    });

    return { readyState };
}
