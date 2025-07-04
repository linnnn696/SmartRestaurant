import { HttpService } from './HttpService';

// 后端返回的订单数据格式
interface BackendOrder {
  order_id: number;
  table_id: number;
  status: string;
  created_at: string;
  updated_at: string;
  items?: BackendOrderItem[]; // 标记为可选
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

export interface CreateOrderItem {
  item_id: number;
  quantity: number;
  price: number;
}

export interface CreateOrderRequest {
  table_id: number;
  user_id: number;
  items: CreateOrderItem[];
}

export enum OrderStatus {
  SUBMITTED = '已提交',    // 已提交
  PREPARING = '制作中',    // 制作中
  COMPLETED = '已完成'     // 已完成
}

// 后端创建订单的响应格式
interface CreateOrderResponse {
  order_id: number;
}

// 状态映射类型
class StatusMapping {
  static getOrderStatus(status: string): OrderStatus {
    // 后端返回中文状态，直接映射
    switch (status) {
      case '已提交':
        return OrderStatus.SUBMITTED;
      case '制作中':
        return OrderStatus.PREPARING;
      case '已完成':
        return OrderStatus.COMPLETED;
      default:
        return OrderStatus.SUBMITTED;  // 默认返回已提交状态
    }
  }
}

export class OrderService {
  /**
   * 将后端订单数据转换为前端格式
   */
  private static convertOrder(backendOrder: BackendOrder): Order {
    console.info('[OrderService] 开始转换订单数据:', JSON.stringify(backendOrder));
    
    return {
      id: String(backendOrder.order_id),
      userId: String(backendOrder.table_id), // 暂时用 table_id 代替 userId
      status: StatusMapping.getOrderStatus(backendOrder.status),
      items: (backendOrder.items || []).map((item: BackendOrderItem): OrderItem => ({
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
    // 转换并排序订单
    const orders = backendOrders
      .map((order: BackendOrder): Order => OrderService.convertOrder(order))
      .sort((a: Order, b: Order) => {
        return Number(a.id) - Number(b.id);
      });
    return orders;
  }

  /**
   * 创建订单
   */
  public static async createOrder(items: OrderItem[], userId: string, initialStatus: OrderStatus = OrderStatus.SUBMITTED): Promise<Order> {
    console.info('[OrderService] 开始创建订单，参数:', { items, userId, initialStatus });
    
    const orderItems: CreateOrderItem[] = items.map((item): CreateOrderItem => {
      return {
        item_id: Number(item.menuItemId),
        quantity: item.quantity,
        price: item.price
      } as CreateOrderItem;
    });

    const data: CreateOrderRequest = {
      table_id: 1, // 默认值
      user_id: 1,  // 默认值
      items: orderItems
    };

    console.info('[OrderService] 发送创建订单请求:', JSON.stringify(data));
    
    const response = await HttpService.post<CreateOrderResponse>('/api/orders', data);
    console.info('[OrderService] 收到后端响应:', JSON.stringify(response));
    
    // 构造订单对象
    return {
      id: String(response.order_id),
      userId: "1",
      items: items,
      status: initialStatus,
      totalAmount: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createTime: new Date().toISOString()
    } as Order;
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
    const data: OrderStatusUpdate = { status: OrderStatus.SUBMITTED };
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