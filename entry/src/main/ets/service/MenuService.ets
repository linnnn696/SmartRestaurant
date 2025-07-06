import http from '@ohos.net.http';
import { HttpService, ApiResponse } from './HttpService';
import { ResourceStr } from '../model/DishModel';

interface ApiMenuItem {
  item_id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  status: boolean;
  sales?: number;
  tag?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
  image: ResourceStr;
  category: string;
  sales?: number;
  tag?: string;
}

export interface CreateMenuItemRequest {
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  tag?: string;
}

export interface UpdateMenuItemRequest {
  name?: string;
  description?: string;
  price?: number;
  image_url?: string;
  category?: string;
  tag?: string;
  status?: boolean;
}

// 定义本地图片映射
const categoryImageMap: Record<string, Resource> = {
  '热菜': $r('app.media.gongbao_chicken'),
  '凉菜': $r('app.media.mixed_veggies'),
  '汤品': $r('app.media.soup_dish'),
  '主食': $r('app.media.steamed_bun'),
  '饮品': $r('app.media.cola')
};

// 默认图片
const DEFAULT_IMAGE: Resource = $r('app.media.gongbao_chicken');

export class MenuService extends HttpService {
  private static readonly defaultImage: Resource = DEFAULT_IMAGE;

  private static convertMenuItem(item: ApiMenuItem): MenuItem {
    try {
      console.info('[MenuService] 开始转换菜单项:', JSON.stringify(item));

      if (!item.item_id) {
        console.error('[MenuService] 菜品ID为空');
        throw new Error('菜品数据不完整：缺少ID');
    }

      // 处理图片
      let image: ResourceStr;
      if (item.image_url?.startsWith('http')) {
        image = item.image_url;
      } else {
        // 使用本地资源路径
        image = $r('app.media.' + item.image_url.replace('.png', ''));
      }

      const menuItem: MenuItem = {
        id: String(item.item_id),
        name: item.name || '未知菜品',
        description: item.description || '',
        price: Number(item.price) || 0,
        image: image,
        category: item.category || '其他',
        sales: item.sales || 0,
        tag: item.tag
      };

      console.info('[MenuService] 菜单项转换结果:', JSON.stringify(menuItem));
      return menuItem;
    } catch (error) {
      console.error('[MenuService] 转换菜单项失败:', error);
      // 如果图片资源加载失败，使用分类默认图片
      const defaultImage = categoryImageMap[item.category] || DEFAULT_IMAGE;
      
      const menuItem: MenuItem = {
        id: String(item.item_id || 0),
        name: item.name || '未知菜品',
        description: item.description || '',
        price: Number(item.price) || 0,
        image: defaultImage,
        category: item.category || '其他',
        sales: item.sales || 0,
        tag: item.tag
      };

      console.info('[MenuService] 使用默认图片的菜单项:', JSON.stringify(menuItem));
      return menuItem;
    }
  }

  /**
   * 获取所有菜单项
   */
  static async getAllMenuItems(): Promise<MenuItem[]> {
    try {
      const response = await HttpService.get<ApiMenuItem[]>('/menu-items');
      return response.map(item => MenuService.convertMenuItem(item));
    } catch (error) {
      console.error('获取菜单项失败:', error);
      throw new Error('获取菜单项失败');
    }
  }

  /**
   * 获取单个菜单项
   */
  static async getMenuItem(id: string): Promise<MenuItem> {
    try {
      const response = await HttpService.get<ApiMenuItem>(`/menu-items/${id}`);
      return MenuService.convertMenuItem(response);
    } catch (error) {
      console.error('获取菜单项失败:', error);
      throw new Error('获取菜单项失败');
    }
  }

  /**
   * 创建菜单项
   */
  static async createMenuItem(data: CreateMenuItemRequest): Promise<MenuItem> {
    try {
      const response = await HttpService.post<ApiMenuItem>('/menu-items', data);
      return MenuService.convertMenuItem(response);
    } catch (error) {
      console.error('创建菜单项失败:', error);
      throw new Error('创建菜单项失败');
    }
  }

  /**
   * 更新菜单项
   */
  static async updateMenuItem(id: string, data: UpdateMenuItemRequest): Promise<MenuItem> {
    try {
      const response = await HttpService.put<ApiMenuItem>(`/menu-items/${id}`, data);
      return MenuService.convertMenuItem(response);
    } catch (error) {
      console.error('更新菜单项失败:', error);
      throw new Error('更新菜单项失败');
    }
  }

  /**
   * 删除菜单项
   */
  static async deleteMenuItem(id: string): Promise<void> {
    try {
      await HttpService.delete<void>(`/menu-items/${id}`);
    } catch (error) {
      console.error('删除菜单项失败:', error);
      throw new Error('删除菜单项失败');
    }
  }
}