import { useRef } from "react";
import useWebSocket from "react-use-websocket";

interface Props {
    url: string;
    onFirstMessage: (data: unknown) => void;
    onUpdateMessage: (data: unknown) => void;
}

export function useHyperloopSocket({ url, onFirstMessage, onUpdateMessage }: Props): { readyState: ReadyState } {
    const firstMsgRef = useRef(true);

    const { readyState } = useWebSocket(url, {
        onOpen: () => {
            firstMsgRef.current = true;
        },
        onMessage: (event) => {
            const data = JSON.parse(event.data);
            if (firstMsgRef.current) {
                firstMsgRef.current = false;
                onFirstMessage(data);
            } else {
                onUpdateMessage(data);
            }
        },
        shouldReconnect: () => true,
    });

    return { readyState };
}

