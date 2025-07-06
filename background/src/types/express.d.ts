import { Request as ExpressRequest, Response as ExpressResponse } from 'express';

declare global {
  namespace Express {
    interface Request extends ExpressRequest {}
    interface Response {
      status(code: number): this;
      json(body: any): void;
      success<T>(data?: T, message?: string): void;
      fail(code?: number, message?: string, data?: any): void;
    }
  }
} 