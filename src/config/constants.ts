export enum HttpStatusCode {
    SUCCESS = 200,
    CREATED = 201,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    CONFLICT = 409,
    GONE = 410,
    SERVER_ERROR = 500,
};

export enum HttpStatusMessage {
    SERVER_ERROR = 'Internal Server Error',
    TOKEN_NOT_FOUND = 'Token Not Found',
    TOKEN_SESSION_EXPIRED = 'Invalid Token or Token Expired',
    NOT_ALLOWED = 'Operation Not Allowed',
};

