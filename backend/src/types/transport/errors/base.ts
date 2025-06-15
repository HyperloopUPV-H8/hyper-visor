import { TransportErrorType } from "../transport-error-type.enum";

export class TransportError extends Error {
    public readonly originalError: Error;

    constructor(
        message: string,
        originalError: Error
    ) {
        super(message);
        this.name = TransportErrorType.TRANSPORT_ERROR;
        this.originalError = originalError;
    }
} 