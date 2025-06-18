import { WebSocketServer } from "ws";
import { logger } from "../logger"
import { Subscription } from "rxjs";
import { IPacketsEmitter } from "types/packets-emitter/packets-emitter.interface";

const PORT = 8003;

export class Transport<T> {
    private _server: WebSocketServer;
    private _emitter: IPacketsEmitter<T>;
    private _subscription!: Subscription;

    constructor(emitter: IPacketsEmitter<T>) {
        this._server = new WebSocketServer({ port: PORT });
        this._emitter = emitter;
        this.setupClientHandler();
        this.subscribeToDataEmitter();
    }

    private setupClientHandler() {
        logger.info('[Transport] Setting up client handler');
        this._server.on('connection', (socket) => {
            logger.info('New client connected');
            socket.on('message', (msg) => {
                logger.info('Client message:', msg);
            });
        });
    }

    private subscribeToDataEmitter() {
        logger.info('[Transport] Subscribing to data emitter');
        this._subscription = this._emitter.subscribe((data) => {
            this.broadcast(data);
        });
    }

    private broadcast(data: any) {
        this._server.clients.forEach((client) => {
            if (client.readyState === client.OPEN) {
                client.send(JSON.stringify(data));
            }
        });
    }

    close() {
        this._subscription.unsubscribe();
        this._server.close();
    }
}