import http from '@ohos.net.http';

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

export class HttpService {
  private static readonly BASE_URL: string = 'http://10.0.2.2:10110/api';

  public static async request<T>(
    path: string,
    method: http.RequestMethod,
    data?: Object
  ): Promise<T> {
    let httpRequest = http.createHttp();
    try {
      const fullUrl = `${HttpService.BASE_URL}${path}`;
      const options: http.HttpRequestOptions = {
        method: method,
        header: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        connectTimeout: 10000,
        readTimeout: 10000,
        expectDataType: http.HttpDataType.STRING,
        usingCache: false,
        extraData: data ? JSON.stringify(data) : undefined
      };
      
      const response = await httpRequest.request(fullUrl, options);
      
      if (!response.result) {
        throw new Error('响应数据为空');
      }

      if (response.responseCode === 200) {
        const responseText = response.result as string;
        const result = JSON.parse(responseText) as ApiResponse<T>;
          
        if (result.code === 200) {
          return result.data;
        }
        throw new Error(result.message || '服务器返回错误');
      }
      
      throw new Error(`HTTP请求失败: ${response.responseCode}`);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(`HTTP请求失败: ${String(error)}`);
      }
    } finally {
      httpRequest.destroy();
    }
  }

  public static async get<T>(path: string): Promise<T> {
    return HttpService.request<T>(path, http.RequestMethod.GET);
  }

  public static async post<T>(path: string, data?: Object): Promise<T> {
    return HttpService.request<T>(path, http.RequestMethod.POST, data);
  }

  public static async put<T>(path: string, data?: Object): Promise<T> {
    return HttpService.request<T>(path, http.RequestMethod.PUT, data);
  }

  public static async delete<T>(path: string): Promise<T> {
    return HttpService.request<T>(path, http.RequestMethod.DELETE);
  }
} 