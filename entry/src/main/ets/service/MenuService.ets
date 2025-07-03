import http from '@ohos.net.http';
import { HttpService } from './HttpService';
import { ResourceStr } from '../model/DishModel';

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

interface ApiMenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  available: boolean;
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
  image: ResourceStr;
  category: string;
  sales?: number;
  isSpicy?: boolean;
  tag?: string;
}

// 定义更新菜单项的请求接口
export interface UpdateMenuItemRequest {
  name?: string;
  description?: string;
  price?: number;
  imageUrl?: string;
  category?: string;
  available?: boolean;
}

// 定义本地图片映射类
class LocalImageMap {
  static readonly kungpao: Resource = $r('app.media.dish_kungpao');
  static readonly fish: Resource = $r('app.media.dish_fish');
  static readonly duck: Resource = $r('app.media.dish_duck');
  static readonly scallop: Resource = $r('app.media.dish_scallop');
  static readonly pork: Resource = $r('app.media.dish_pork');
  static readonly soup: Resource = $r('app.media.dish_soup');
  static readonly bun: Resource = $r('app.media.dish_bun');
  static readonly veggie: Resource = $r('app.media.dish_veggie');
}

// 默认图片
const DEFAULT_IMAGE: Resource = $r('app.media.dish_kungpao');

export interface CreateMenuItemRequest {
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  available: boolean;
}

export class MenuService extends HttpService {
  private readonly BASE_URL: string = 'http://10.0.2.2:10110';  // 鸿蒙模拟器访问主机 localhost 的专用地址
  private readonly defaultImage: Resource = $r('app.media.dish_fish');

  // 验证 ApiResponse 结构
  private validateApiResponse<T>(response: Object): boolean {
    try {
      const apiResponse = response as ApiResponse<T>;
      // 只验证基本结构
      return apiResponse !== null && apiResponse !== undefined;
    } catch {
      return false;
    }
  }

  // 验证 ApiMenuItem 结构
  private validateApiMenuItem(item: Object): boolean {
    try {
      const menuItem = item as ApiMenuItem;
      // 只验证必要字段
      return (
        menuItem !== null &&
        menuItem !== undefined &&
        menuItem.id !== undefined &&
        menuItem.name !== undefined
      );
    } catch {
      return false;
    }
  }

  private async request<T>(
    path: string,
    method: http.RequestMethod,
    data?: Object
  ): Promise<T> {
    let httpRequest = http.createHttp();
    try {
      console.info(`[HTTP] 发起请求: ${method} ${this.BASE_URL}${path}`);
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
      
      const response = await httpRequest.request(
        `${this.BASE_URL}${path}`,
        options
      );

      console.info(`[HTTP] 响应状态码: ${response.responseCode}`);
      console.info('[HTTP] 响应头:', JSON.stringify(response.header));
      
      if (!response.result) {
        console.error('[HTTP] 响应数据为空');
        throw new Error('响应数据为空');
      }

      console.info('[HTTP] 响应数据:', JSON.stringify(response.result));

      // 处理直接返回数组的情况
      if (Array.isArray(response.result)) {
        return response.result as T;
      }

      if (response.responseCode === 200) {
        // 尝试解析为 ApiResponse
        if (this.validateApiResponse<T>(response.result)) {
          const result = response.result as ApiResponse<T>;
          if (result.code === 200 || !result.code) {  // 允许没有 code 字段
            return result.data;
          }
          throw new Error(result.message || '服务器返回错误');
        }
        // 如果不是标准响应格式，直接返回结果
        return response.result as T;
      }
      
      throw new Error(`HTTP请求失败: ${response.responseCode}`);
    } catch (error) {
      console.error('[HTTP] 请求异常:', error);
      if (error instanceof Error) {
        console.error('[HTTP] 错误详情:', error.message);
        console.error('[HTTP] 错误堆栈:', error.stack);
      }
      throw new Error(error instanceof Error ? error.message : '未知错误');
    } finally {
      if (httpRequest) {
        httpRequest.destroy();
      }
    }
  }

  private convertMenuItem(item: Object): MenuItem {
    try {
      console.info('转换菜单项:', JSON.stringify(item));
      
      // 使用更宽松的类型转换
      const apiItem = item as ApiMenuItem;
      return {
        id: apiItem.id?.toString() || '0',
        name: apiItem.name || '未知菜品',
        description: apiItem.description || '',
        price: Number(apiItem.price) || 0,
        image: this.defaultImage,  // 始终使用默认图片
        category: apiItem.category || '其他',
        available: apiItem.available !== false,  // 默认为 true
        sales: apiItem.sales,
        isSpicy: apiItem.isSpicy,
        tag: apiItem.tag
      };
    } catch (error) {
      console.error('转换菜单项失败:', error);
      throw new Error('菜单项格式不正确');
    }
  }

  /**
   * 获取所有菜单项
   */
  static async getAllMenuItems(): Promise<MenuItem[]> {
    return this.get<MenuItem[]>('/api/menu-items');
  }

  /**
   * 获取单个菜单项
   */
  static async getMenuItem(param: string): Promise<MenuItem> {
    return this.get<MenuItem>(`/api/menu-items/${param}`);
  }

  /**
   * 创建菜单项
   */
  static async createMenuItem(data: Omit<MenuItem, 'id'>): Promise<MenuItem> {
    return this.post<MenuItem>('/api/menu-items', data);
  }

  /**
   * 更新菜单项
   */
  static async updateMenuItem(param: string, data: Partial<MenuItem>): Promise<MenuItem> {
    return this.put<MenuItem>(`/api/menu-items/${param}`, data);
  }

  /**
   * 删除菜单项
   */
  static async deleteMenuItem(param: string): Promise<void> {
    return this.delete<void>(`/api/menu-items/${param}`);
  }
}