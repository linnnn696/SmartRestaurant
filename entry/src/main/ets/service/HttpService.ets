import http from '@ohos.net.http';

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

export class HttpService {
  private static readonly BASE_URL: string = 'http://10.0.2.2:10110';  // 鸿蒙模拟器访问主机 localhost 的专用地址

  public static async request<T>(
    path: string,
    method: http.RequestMethod,
    data?: Object
  ): Promise<T> {
    let httpRequest = http.createHttp();
    try {
      const fullUrl = `${HttpService.BASE_URL}${path}`;
      console.info(`[HTTP] 发起请求: ${method} ${fullUrl}`);
      if (data) {
        console.info('[HTTP] 请求数据:', JSON.stringify(data));
      }

      // 配置请求选项
      const options: http.HttpRequestOptions = {
        method: method,
        header: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        connectTimeout: 10000,
        readTimeout: 10000,
        expectDataType: http.HttpDataType.OBJECT,
        usingCache: false,
        extraData: data ? JSON.stringify(data) : undefined
      };

      console.info('[HTTP] 请求选项:', JSON.stringify(options));
      
      // 发起请求
      const response = await httpRequest.request(fullUrl, options);

      console.info(`[HTTP] 响应状态码: ${response.responseCode}`);
      console.info('[HTTP] 响应头:', JSON.stringify(response.header));
      
      if (!response.result) {
        console.error('[HTTP] 响应数据为空');
        throw new Error('响应数据为空');
      }

      console.info('[HTTP] 响应数据:', JSON.stringify(response.result));

      if (response.responseCode === 200) {
        const result = response.result as ApiResponse<T>;
        if (result.code === 200) {
          return result.data;
        }
        throw new Error(result.message || '服务器返回错误');
      }
      
      throw new Error(`HTTP请求失败: ${response.responseCode}`);
    } catch (error) {
      console.error('[HTTP] 请求异常:', error);
      if (error instanceof Error) {
        console.error('[HTTP] 错误详情:', error.message);
        console.error('[HTTP] 错误堆栈:', error.stack);
      }
      throw new Error(String(error));
    } finally {
      // 确保请求客户端被销毁
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