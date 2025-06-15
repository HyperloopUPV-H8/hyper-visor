import { TransportErrorType } from "../transport-error-type.enum";
import { TransportError } from "./base";

export class WebSocketConnectionError extends TransportError {
    public readonly port: number;
    public readonly host: string;

    constructor(
        message: string,
        originalError: Error,
        port: number,
        host: string
    ) {
        super(message, originalError);
        this.name = TransportErrorType.WEBSOCKET_CONNECTION_ERROR;
        this.port = port;
        this.host = host;
    }
} 