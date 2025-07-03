import { HttpService } from './HttpService';

export interface User {
  id: string;
  username: string;
  points: number;
  createdAt: string;
  updatedAt: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
}

export interface Order {
  id: string;
  userId: string;
  items: Array<{
    menuItemId: string;
    quantity: number;
  }>;
  status: string;
  totalAmount: number;
  createdAt: string;
}

export class UserService extends HttpService {
  /**
   * 用户注册
   */
  static async register(data: RegisterRequest): Promise<User> {
    return this.post<User>('/api/users/register', data);
  }

  /**
   * 获取用户信息
   */
  static async getUserInfo(userId: string): Promise<User> {
    return this.get<User>(`/api/users/${userId}`);
  }

  /**
   * 更新用户积分
   */
  static async updateUserPoints(userId: string, points: number): Promise<User> {
    return this.put<User>(`/api/users/${userId}/points`, { points });
  }

  /**
   * 获取用户订单历史
   */
  static async getUserOrders(userId: string): Promise<Order[]> {
    return this.get<Order[]>(`/api/users/${userId}/orders`);
  }
} 