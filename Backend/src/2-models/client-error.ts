abstract class ClientError {
    public status: number;
    public message: string;

    public constructor(status: number, message: string) {
        this.status = status;
        this.message = message;
    }
}

export class RouteNotFound extends ClientError {
    public constructor(route: string) {
        super(404, `Route: ${route} not found`);
    }
}

export class ResourceNotFound extends ClientError {
    public constructor(id: number) {
        super(404, `ID: ${id} not found`);
    }
}

export class ValidationError extends ClientError {
    public constructor(message: string) {
        super(400, message);
    }
}

export class UnauthorizedError extends ClientError {
    public constructor(message: string) {
        super(401, message);
    }
}