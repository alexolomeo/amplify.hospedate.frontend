class ValidationError extends Error {
  public fields: Record<string, string>;
  constructor(fields: Record<string, string>) {
    super('VALIDATION_ERROR');
    this.name = 'ValidationError';
    this.fields = fields;
  }
}

export { ValidationError };
