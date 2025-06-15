import { logger } from "modules/logger";
import { DecodedPacket } from "types/packet/decoded-packet.interface";
import { IPacketsEmitter, SubscriberId } from "types/packets-emitter/packets-emitter.interface";
import { WebSocketServer } from 'ws';
import { WebSocketConnectionError } from "./errors/websocket-connection.error";

const WEBSOCKET_PORT = 8090;
const WEBSOCKET_HOST = 'localhost';

const WEBSOCKET_CONNECTION_EVENT = 'connection';
const WEBSOCKET_MESSAGE_EVENT = 'message';
const WEBSOCKET_ERROR_EVENT = 'error';

export class Transport {
    private _packetsEmitter: IPacketsEmitter<DecodedPacket>;
    private _packetsEmitterSubscriptionId!: SubscriberId;
    private _websocket: WebSocketServer;

    constructor(packetsEmitter: IPacketsEmitter<DecodedPacket>) {
        this._packetsEmitter = packetsEmitter;
        try {
            this._websocket = new WebSocketServer({
                port: WEBSOCKET_PORT,
                host: WEBSOCKET_HOST
            });
        } catch (error) {
            throw new WebSocketConnectionError(
                `Failed to create WebSocket server on ${WEBSOCKET_HOST}:${WEBSOCKET_PORT}`,
                error as Error,
                WEBSOCKET_PORT,
                WEBSOCKET_HOST
            );
        }
    }

    /**
     * Start the websocket server
     */
    start(): void {
        logger.info(`Starting WebSocket server on: ${WEBSOCKET_HOST}:${WEBSOCKET_PORT}`);

        this._packetsEmitterSubscriptionId = this._packetsEmitter.subscribe((packet) => {
            console.log(packet);
        });

        this._websocket.on(WEBSOCKET_CONNECTION_EVENT, (ws) => {
            logger.info(`WebSocket connected: ${ws.url}`);
            // TODO: Send the ADJ structure serialized to the client
        });

        this._websocket.on(WEBSOCKET_ERROR_EVENT, (error) => {
            logger.error(new WebSocketConnectionError(
                'WebSocket server error',
                error as Error,
                WEBSOCKET_PORT,
                WEBSOCKET_HOST
            ));
        });
    }

    /**
     * Stop the websocket server
     */
    stop(): void {
        logger.info(`Stopping WebSocket server on: ${WEBSOCKET_HOST}:${WEBSOCKET_PORT}`);

        this._packetsEmitter.unsubscribe(this._packetsEmitterSubscriptionId);
        this._websocket.close();
    }
}