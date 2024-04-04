export class CustomError extends Error {
  constructor(
    public readonly statusCode: number = 500,
    public readonly message: string,
    public details?: any
  ) {
    super(message);
  }

  static badRequest(message: string, details?: any) {
    return new CustomError(400, message, details);
  }
  static unauthorized(message: string, details?: any) {
    return new CustomError(401, message, details);
  }
  static forbidden(message: string, details?: any) {
    return new CustomError(403, message, details);
  }
  static notFound(message: string, details?: any) {
    return new CustomError(404, message, details);
  }
  static internalServer(message: string = 'Internal server error', details?: any) {
    return new CustomError(500, message, details);
  }
}
