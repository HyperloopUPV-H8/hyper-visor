import { ADJErrorType } from "./ADJErrorType.enum";

export class ADJError extends Error {
    public readonly name: string;
    public readonly originalError: Error;

    constructor(
        message: string,
        originalError: Error
    ) {
        super(message);
        this.name = ADJErrorType.ADJ_ERROR;
        this.originalError = originalError;
    }
}