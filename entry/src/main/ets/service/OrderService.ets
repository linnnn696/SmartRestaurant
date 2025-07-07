import { HttpService } from './HttpService';

interface BackendOrder {
  order_id: number;
  user_id: number;
  status: string;
  created_at: string;
  updated_at: string;
  items?: BackendOrderItem[];
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
  menu_item_id: number;
  quantity: number;
  price: number;
}

export interface CreateOrderRequest {
  user_id: string;
  items: CreateOrderItem[];
}

export enum OrderStatus {
  PREPARING = '制作中',
  COMPLETED = '已完成'
}

interface CreateOrderResponse {
  order_id: number;
  user_id: number;
  status: string;
  total_amount: number;
  created_at: string;
  updated_at: string;
  items: BackendOrderItem[];
}

class StatusMapping {
  static getOrderStatus(status: string): OrderStatus {
    switch (status) {
      case '已完成':
        return OrderStatus.COMPLETED;
      default:
        return OrderStatus.PREPARING;
    }
  }
}

function formatDateTime(dateStr: string): string {
  if (!dateStr) return '未知';
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    
    const pad = (num: number) => num.toString().padStart(2, '0');
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());
    
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  } catch (error) {
    return dateStr;
  }
}

export class OrderService {
  private static convertOrder(backendOrder: BackendOrder): Order {
    return {
      id: String(backendOrder.order_id),
      userId: String(backendOrder.user_id),
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
      createTime: formatDateTime(backendOrder.created_at)
    };
  }

  public static async getAllOrders(): Promise<Order[]> {
    const backendOrders: BackendOrder[] = await HttpService.get<BackendOrder[]>('/orders');
    const orders = backendOrders
      .map((order: BackendOrder): Order => OrderService.convertOrder(order))
      .sort((a: Order, b: Order) => Number(b.id) - Number(a.id));
    return orders;
  }

  public static async createOrder(items: OrderItem[], userId: string, initialStatus: OrderStatus = OrderStatus.PREPARING): Promise<Order> {
    const orderItems: CreateOrderItem[] = items.map((item): CreateOrderItem => {
      const menuItemId = Number(item.menuItemId);
      const quantity = Number(item.quantity);
      const price = Number(item.price);

      if (isNaN(menuItemId) || isNaN(quantity) || isNaN(price)) {
        throw new Error('订单数据格式错误');
      }

      return {
        menu_item_id: menuItemId,
        quantity: quantity,
        price: price
      };
    });

    const data: CreateOrderRequest = {
      user_id: userId,
      items: orderItems
    };

    const orderData = await HttpService.post<CreateOrderResponse>('/orders', data);
    
    if (!orderData || !orderData.order_id || !orderData.items || !Array.isArray(orderData.items)) {
      throw new Error('创建订单失败：服务器响应数据格式错误');
    }

    return {
      id: String(orderData.order_id),
      userId: String(data.user_id),
      items: orderData.items.map((item: BackendOrderItem): OrderItem => ({
        menuItemId: String(item.menu_item_id),
        name: item.name,
        price: item.price,
        quantity: item.quantity
      })),
      status: StatusMapping.getOrderStatus(orderData.status),
      totalAmount: orderData.total_amount,
      createdAt: orderData.created_at,
      updatedAt: orderData.updated_at,
      createTime: orderData.created_at
    };
  }

  public static async getOrderDetail(orderId: string): Promise<Order> {
    const backendOrder: BackendOrder = await HttpService.get<BackendOrder>(`/orders/${orderId}`);
    return OrderService.convertOrder(backendOrder);
  }

  public static async updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order> {
    const data: OrderStatusUpdate = { status };
    const backendOrder: BackendOrder = await HttpService.put<BackendOrder>(`/orders/${orderId}/status`, data);
    return OrderService.convertOrder(backendOrder);
  }
} 