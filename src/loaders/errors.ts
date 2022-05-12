import { HttpStatusCode } from '@/config/constants';

export class APIError extends Error {
    public readonly status: HttpStatusCode;

    constructor(status: HttpStatusCode, message: string) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
        this.status = status;
        Error.captureStackTrace(this);
    }
}
