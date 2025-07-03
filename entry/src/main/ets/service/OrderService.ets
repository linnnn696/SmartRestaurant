import { HttpService } from './HttpService';

// 后端返回的订单数据格式
interface BackendOrder {
  order_id: number;
  table_id: number;
  status: string;
  created_at: string;
  updated_at: string;
  items: BackendOrderItem[];
  total_amount: number;
}

interface BackendOrderItem {
  name: string;
  price: number;
  quantity: number;
  menu_item_id: string;
}

export interface OrderItem {
  menuItemId: string;
  quantity: number;
  price: number;
  name: string;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  status: OrderStatus;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
  createTime: string;
}

export interface OrderStatusUpdate {
  status: OrderStatus;
}

export interface CreateOrderRequest {
  userId: string;
  items: OrderItem[];
  status: OrderStatus;
  totalAmount: number;
}

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PREPARING = 'preparing',
  READY = 'ready',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

// 状态映射类型
class StatusMapping {
  static getOrderStatus(status: string): OrderStatus {
    switch (status) {
      case '待处理':
        return OrderStatus.PENDING;
      case '已确认':
        return OrderStatus.CONFIRMED;
      case '制作中':
        return OrderStatus.PREPARING;
      case '待取餐':
        return OrderStatus.READY;
      case '已完成':
        return OrderStatus.COMPLETED;
      case '已取消':
        return OrderStatus.CANCELLED;
      default:
        return OrderStatus.PENDING;
    }
  }
}

export class OrderService {
  /**
   * 将后端订单数据转换为前端格式
   */
  private static convertOrder(backendOrder: BackendOrder): Order {
    return {
      id: String(backendOrder.order_id),
      userId: String(backendOrder.table_id), // 暂时用 table_id 代替 userId
      status: StatusMapping.getOrderStatus(backendOrder.status),
      items: backendOrder.items.map((item: BackendOrderItem): OrderItem => ({
        menuItemId: String(item.menu_item_id),
        name: item.name,
        price: item.price,
        quantity: item.quantity
      })),
      totalAmount: backendOrder.total_amount,
      createdAt: backendOrder.created_at,
      updatedAt: backendOrder.updated_at,
      createTime: backendOrder.created_at // 兼容性字段
    };
  }

  /**
   * 获取所有订单
   */
  public static async getAllOrders(): Promise<Order[]> {
    const backendOrders: BackendOrder[] = await HttpService.get<BackendOrder[]>('/api/orders');
    return backendOrders.map((order: BackendOrder): Order => OrderService.convertOrder(order));
  }

  /**
   * 创建订单
   */
  public static async createOrder(items: OrderItem[], userId: string): Promise<Order> {
    const data: CreateOrderRequest = {
      userId,
      items,
      status: OrderStatus.PENDING,
      totalAmount: items.reduce((sum: number, item: OrderItem): number => sum + item.price * item.quantity, 0)
    };
    const backendOrder: BackendOrder = await HttpService.post<BackendOrder>('/api/orders', data);
    return OrderService.convertOrder(backendOrder);
  }

  /**
   * 获取订单详情
   */
  public static async getOrderDetail(orderId: string): Promise<Order> {
    const backendOrder: BackendOrder = await HttpService.get<BackendOrder>(`/api/orders/${orderId}`);
    return OrderService.convertOrder(backendOrder);
  }

  /**
   * 更新订单状态
   */
  public static async updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order> {
    const data: OrderStatusUpdate = { status };
    const backendOrder: BackendOrder = await HttpService.put<BackendOrder>(`/api/orders/${orderId}/status`, data);
    return OrderService.convertOrder(backendOrder);
  }

  /**
   * 取消订单
   */
  public static async cancelOrder(orderId: string): Promise<Order> {
    const data: OrderStatusUpdate = { status: OrderStatus.CANCELLED };
    const backendOrder: BackendOrder = await HttpService.put<BackendOrder>(`/api/orders/${orderId}/cancel`, data);
    return OrderService.convertOrder(backendOrder);
  }

  /**
   * 获取用户的订单历史
   */
  public static async getUserOrders(userId: string): Promise<Order[]> {
    const backendOrders: BackendOrder[] = await HttpService.get<BackendOrder[]>(`/api/users/${userId}/orders`);
    return backendOrders.map((order: BackendOrder): Order => OrderService.convertOrder(order));
  }
} 