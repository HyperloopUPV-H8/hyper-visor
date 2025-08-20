import { useRef } from "react";
import useWebSocket from "react-use-websocket";
import type { ReadyState } from "react-use-websocket";

interface Props<TFirst, TUpdate> {
    url: string;
    onFirstMessage: (data: TFirst) => void;
    onUpdateMessage: (data: TUpdate) => void;
}

export function useHyperloopSocket<TFirst = unknown, TUpdate = unknown>(
    { url, onFirstMessage, onUpdateMessage }: Props<TFirst, TUpdate>
): { readyState: ReadyState } {
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

