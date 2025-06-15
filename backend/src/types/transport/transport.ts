import { logger } from "modules/logger";
import { DecodedPacket } from "types/packet/decoded-packet.interface";
import { IPacketsEmitter, SubscriberId } from "types/packets-emitter/packets-emitter.interface";
import { WebSocketServer } from 'ws';

const WEBSOCKET_PORT = 8090;
const WEBSOCKET_HOST = 'localhost';

const WEBSOCKET_CONNECTION_EVENT = 'connection';
const WEBSOCKET_MESSAGE_EVENT = 'message';
const WEBSOCKET_CLOSE_EVENT = 'close';
const WEBSOCKET_ERROR_EVENT = 'error';

export class Transport {
    private _packetsEmitter: IPacketsEmitter<DecodedPacket>;
    private _packetsEmitterSubscriptionId!: SubscriberId;
    private _websocket: WebSocketServer;

    constructor(packetsEmitter: IPacketsEmitter<DecodedPacket>) {
        this._packetsEmitter = packetsEmitter;
        this._websocket = new WebSocketServer({
            port: WEBSOCKET_PORT,
            host: WEBSOCKET_HOST
        });
    }

    /**
     * Start the websocket server
     */
    start(): void {
        this._packetsEmitterSubscriptionId = this._packetsEmitter.subscribe((packet) => {
            console.log(packet);
        });

        this._websocket.on(WEBSOCKET_CONNECTION_EVENT, (ws) => {
            logger.info('WebSocket connected');
            // TODO: Send the ADJ structure serialized to the client
        });
    }

    /**
     * Stop the websocket server
     */
    stop(): void {
        this._packetsEmitter.unsubscribe(this._packetsEmitterSubscriptionId);
        this._websocket.close();
    }
}