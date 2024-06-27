export class CustomError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public errors?: string
  ) {
    super(message);
    this.name = "CustomError";
    this.errors = errors || "";

    Object.setPrototypeOf(this, CustomError.prototype);
  }
}
