import { WebSocketServer, WebSocket } from "ws";
import { logger } from "../logger"
import { DecodedPacket } from "../../types/packet/decoded-packet.interface";
import { IPacketsEmitter, SubscriberId } from "../../types/packets-emitter/packets-emitter.interface";
import { WebSocketConnectionError } from "../../types/transport/errors/websocket-connection.error";
import { ADJ } from "modules/adj";
import { ITransport } from "types/transport";

// TODO: Move this to env vars
const WEBSOCKET_PORT = 8090;
const WEBSOCKET_HOST = '0.0.0.0';

const WEBSOCKET_CONNECTION_EVENT = 'connection';
const WEBSOCKET_MESSAGE_EVENT = 'message';
const WEBSOCKET_ERROR_EVENT = 'error';

export class Transport implements ITransport {
    private _packetsEmitter: IPacketsEmitter<DecodedPacket>;
    private _packetsEmitterSubscriptionId!: SubscriberId;
    private _websocket: WebSocketServer;
    private _clients: Set<WebSocket>;
    private _adj: ADJ;

    constructor(packetsEmitter: IPacketsEmitter<DecodedPacket>, adj: ADJ) {
        this._packetsEmitter = packetsEmitter;
        this._adj = adj;
        this._clients = new Set();
        try {
            this._websocket = new WebSocketServer({
                port: WEBSOCKET_PORT,
                host: WEBSOCKET_HOST
            });
            this._websocket.on(WEBSOCKET_ERROR_EVENT, (error) => {
                logger.error(new WebSocketConnectionError(
                    '[Transport] WebSocket server error',
                    error as Error,
                    WEBSOCKET_PORT,
                    WEBSOCKET_HOST
                ));
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
        logger.info(`[Transport] Starting WebSocket server on: ${WEBSOCKET_HOST}:${WEBSOCKET_PORT}`);

        this._websocket.on(WEBSOCKET_CONNECTION_EVENT, (ws) => {
            logger.info(`[Transport] WebSocket connected: ${ws.url}`);
            ws.send(this._adj.serialize());
            this._clients.add(ws);
        });

        this._packetsEmitterSubscriptionId = this._packetsEmitter.subscribe((packet) => {
            this._websocket.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(packet));
                }
            });
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