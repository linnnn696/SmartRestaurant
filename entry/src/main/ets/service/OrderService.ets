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
  PREPARING = '制作中',    // 制作中
  COMPLETED = '已完成'     // 已完成
}

// 后端创建订单的响应格式
interface CreateOrderResponse {
  order_id: number;
  table_id: number;
  status: string;
  total_amount: number;
  created_at: string;
  updated_at: string;
  items: BackendOrderItem[];
}

// 状态映射类型
class StatusMapping {
  static getOrderStatus(status: string): OrderStatus {
    // 后端返回中文状态，直接映射
    switch (status) {
      case '已完成':
        return OrderStatus.COMPLETED;
      default:
        return OrderStatus.PREPARING;  // 默认返回制作中状态
    }
  }
}

// 格式化日期时间
function formatDateTime(dateStr: string): string {
  if (!dateStr) return '未知';
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;  // 如果转换失败，返回原始字符串
    
    const pad = (num: number) => num.toString().padStart(2, '0');
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());
    
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  } catch (error) {
    console.error('时间格式化错误:', error);
    return dateStr;  // 发生错误时返回原始字符串
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
      createdAt: formatDateTime(backendOrder.created_at),
      updatedAt: formatDateTime(backendOrder.updated_at),
      createTime: formatDateTime(backendOrder.created_at) // 兼容性字段
    };
  }

  /**
   * 获取所有订单
   */
  public static async getAllOrders(): Promise<Order[]> {
    const backendOrders: BackendOrder[] = await HttpService.get<BackendOrder[]>('/orders');
    // 转换并按订单ID降序排序
    const orders = backendOrders
      .map((order: BackendOrder): Order => OrderService.convertOrder(order))
      .sort((a: Order, b: Order) => {
        return Number(b.id) - Number(a.id);  // 改为降序排序
      });
    return orders;
  }

  /**
   * 创建订单
   */
  public static async createOrder(items: OrderItem[], userId: string, initialStatus: OrderStatus = OrderStatus.PREPARING): Promise<Order> {
    console.info('[OrderService] 开始创建订单，参数:', { items, userId, initialStatus });
    
    const orderItems: CreateOrderItem[] = items.map((item): CreateOrderItem => {
      // 确保数值类型正确
      const itemId = Number(item.menuItemId);
      const quantity = Number(item.quantity);
      const price = Number(item.price);

      if (isNaN(itemId) || isNaN(quantity) || isNaN(price)) {
        console.error('[OrderService] 数据类型转换错误:', { itemId, quantity, price });
        throw new Error('订单数据格式错误');
      }

      return {
        item_id: itemId,
        quantity: quantity,
        price: price
      };
    });

    const data: CreateOrderRequest = {
      table_id: 1, // 默认值
      user_id: 1,  // 默认值
      items: orderItems
    };

    console.info('[OrderService] 发送创建订单请求:', JSON.stringify(data));
    
    try {
      // 发送创建订单请求并获取完整的订单数据
      const orderData = await HttpService.post<CreateOrderResponse>('/orders', data);
      console.info('[OrderService] 收到后端响应:', JSON.stringify(orderData));

      if (!orderData) {
        console.error('[OrderService] 服务器响应为空');
        throw new Error('创建订单失败：服务器响应为空');
      }

      if (!orderData.order_id) {
        console.error('[OrderService] 订单ID为空:', orderData);
        throw new Error('创建订单失败：订单ID为空');
      }

      if (!orderData.items) {
        console.error('[OrderService] 订单项数据为空:', orderData);
        throw new Error('创建订单失败：订单项数据为空');
      }

      if (!Array.isArray(orderData.items)) {
        console.error('[OrderService] 订单项不是数组:', typeof orderData.items);
        throw new Error('创建订单失败：订单项数据格式错误');
      }

      // 使用后端返回的数据构造订单对象
      const order: Order = {
        id: String(orderData.order_id),
        userId: String(data.user_id),
        items: orderData.items.map((item: BackendOrderItem): OrderItem => {
          if (!item.menu_item_id || !item.name || typeof item.price !== 'number' || typeof item.quantity !== 'number') {
            console.error('[OrderService] 订单项数据不完整:', item);
            throw new Error('订单项数据不完整');
          }
          return {
            menuItemId: String(item.menu_item_id),
            name: item.name,
            price: item.price,
            quantity: item.quantity
          };
        }),
        status: StatusMapping.getOrderStatus(orderData.status),
        totalAmount: orderData.total_amount,
        createdAt: orderData.created_at,
        updatedAt: orderData.updated_at,
        createTime: orderData.created_at
      };

      console.info('[OrderService] 订单对象构造完成:', JSON.stringify(order));
      return order;
    } catch (error) {
      console.error('[OrderService] 创建订单失败:', error);
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('创建订单时发生未知错误');
      }
    }
  }

  /**
   * 获取订单详情
   */
  public static async getOrderDetail(orderId: string): Promise<Order> {
    const backendOrder: BackendOrder = await HttpService.get<BackendOrder>(`/orders/${orderId}`);
    return OrderService.convertOrder(backendOrder);
  }

  /**
   * 更新订单状态
   */
  public static async updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order> {
    const data: OrderStatusUpdate = { status };
    const backendOrder: BackendOrder = await HttpService.put<BackendOrder>(`/orders/${orderId}/status`, data);
    return OrderService.convertOrder(backendOrder);
  }

  /**
   * 取消订单
   */
  public static async cancelOrder(orderId: string): Promise<Order> {
    const data: OrderStatusUpdate = { status: OrderStatus.PREPARING };
    const backendOrder: BackendOrder = await HttpService.put<BackendOrder>(`/orders/${orderId}/cancel`, data);
    return OrderService.convertOrder(backendOrder);
  }

  /**
   * 获取用户的订单历史
   */
  public static async getUserOrders(userId: string): Promise<Order[]> {
    const backendOrders: BackendOrder[] = await HttpService.get<BackendOrder[]>(`/users/${userId}/orders`);
    return backendOrders.map((order: BackendOrder): Order => OrderService.convertOrder(order));
  }
} 