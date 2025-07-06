import { Response } from 'express';

interface ApiResponse<T = any> {
  code: number;
  message: string;
  data?: T;
}

/**
 * 成功响应
 * @param res Express Response 对象
 * @param data 响应数据
 * @param message 成功消息
 */
export const success = <T>(res: Response, data: T | null = null, message: string = '操作成功') => {
  res.json({
    code: 200,
    message,
    data
  });
};

/**
 * 失败响应
 * @param res Express Response 对象
 * @param code HTTP状态码
 * @param message 错误消息
 * @param data 错误详情数据
 */
export const fail = (res: Response, code: number = 500, message: string = '操作失败', data: any = null) => {
  res.json({
    code,
    message,
    data
  });
};

export function createSuccessResponse<T>(data?: T, message: string = '操作成功'): ApiResponse<T> {
  return {
    code: 200,
    message,
    data
  };
}

export function createErrorResponse(message: string, code: number = 400): ApiResponse {
  return {
    code,
    message
  };
} 