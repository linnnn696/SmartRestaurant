import { HttpService } from './HttpService';

// 菜品信息接口
export interface MenuItem {
  item_id: number;
  name: string;
  category: string;
  price: number;
  image_url?: string;
  is_hot: boolean;
  is_new: boolean;
  is_combo: boolean;
  status: boolean;
}

// 订单项接口
export interface OrderItem {
  order_item_id: number;
  order_id: number;
  item_id: number;
  name: string;
  quantity: number;
  price: number;
  subtotal: number;
  menuItem: MenuItem;
}

// 订单接口
export interface Order {
  order_id: number;
  table_id: number;
  user_id: number;
  status: string;
  total_amount: number;
  created_at: string;
  updated_at: string;
  items: OrderItem[];
}

// 创建订单项接口
export interface CreateOrderItem {
  item_id: number;
  quantity: number;
}

// 创建订单请求接口
export interface CreateOrderRequest {
  table_id: number;
  user_id: number;
  items: CreateOrderItem[];
}

// 更新订单状态请求接口
export interface UpdateOrderStatusRequest {
  status: OrderStatus;
}

// 订单状态枚举
export enum OrderStatus {
  SUBMITTED = '已提交',
  PREPARING = '制作中',
  READY = '待取餐',
  COMPLETED = '已完成'
}

export class OrderService {
  /**
   * 转换订单状态显示
   */
  private static convertOrderStatus(status: string): string {
    switch (status) {
      case '已提交':
        return '已提交';
      case '制作中':
        return '制作中';
      case '待取餐':
        return '待取餐';
      case '已完成':
        return '已完成';
      default:
        return status;
    }
  }

  /**
   * 转换单个订单数据
   */
  private static convertOrder(order: Order): Order {
    const convertedOrder = new Object() as Order;
    convertedOrder.order_id = order.order_id;
    convertedOrder.table_id = order.table_id;
    convertedOrder.user_id = order.user_id;
    convertedOrder.status = OrderService.convertOrderStatus(order.status);
    convertedOrder.total_amount = order.total_amount;
    convertedOrder.created_at = order.created_at;
    convertedOrder.updated_at = order.updated_at;
    convertedOrder.items = order.items;
    return convertedOrder;
  }

  /**
   * 获取所有订单
   */
  public static async getAllOrders(): Promise<Order[]> {
    const orders = await HttpService.get<Order[]>('/api/orders');
    return orders.map(order => OrderService.convertOrder(order));
  }

  /**
   * 创建订单
   */
  public static async createOrder(data: CreateOrderRequest): Promise<Order> {
    const order = await HttpService.post<Order>('/api/orders', data);
    return OrderService.convertOrder(order);
  }

  /**
   * 获取订单详情
   */
  public static async getOrderDetail(orderId: number): Promise<Order> {
    const order = await HttpService.get<Order>(`/api/orders/${orderId}`);
    return OrderService.convertOrder(order);
  }

  /**
   * 更新订单状态
   */
  public static async updateOrderStatus(orderId: number, status: OrderStatus): Promise<Order> {
    const updateData: UpdateOrderStatusRequest = { status };
    const order = await HttpService.put<Order>(`/api/orders/${orderId}/status`, updateData);
    return OrderService.convertOrder(order);
  }

  /**
   * 获取用户的订单历史
   */
  public static async getUserOrders(userId: number): Promise<Order[]> {
    const orders = await HttpService.get<Order[]>(`/api/users/${userId}/orders`);
    return orders.map(order => OrderService.convertOrder(order));
  }
} 