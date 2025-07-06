declare namespace Express {
  export interface Response {
    success: <T>(data?: T, message?: string) => void;
    fail: (code: number, message: string, data?: any) => void;
  }
} 