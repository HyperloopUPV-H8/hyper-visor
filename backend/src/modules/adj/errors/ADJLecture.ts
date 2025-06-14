import { ADJErrorType } from "./ADJErrorType.enum";
import { ADJError } from "./base";

export class ADJLectureError extends ADJError {
    public readonly name: string;
    public readonly path: string

    constructor(
        message: string,
        originalError: Error,
        path?: string
    ) {
        super(message, originalError);
        this.name = ADJErrorType.ADJ_LECTURE_ERROR;
        this.path = path || '';
    }
}