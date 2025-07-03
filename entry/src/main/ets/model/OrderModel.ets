import { CartItem, CartModel, SAMPLE_DISHES } from './DishModel';

export type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled';

// 定义基础订单项接口
export interface BaseOrderItem {
  dishId: string;
  name: string;
  price: number;
  quantity: number;
}

// 实现订单项类
export class OrderItem implements BaseOrderItem {
  dishId: string;
  name: string;
  price: number;
  quantity: number;

  constructor(cartItem: CartItem) {
    const dish = SAMPLE_DISHES.find(d => d.id === cartItem.dishId);
    this.dishId = cartItem.dishId;
    this.quantity = cartItem.quantity;
    this.name = dish?.name || '未知商品';
    this.price = dish?.price || 0;
  }
}

export interface Order {
  id: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  createTime: string;
  tableId?: string;
}

export class OrderModel {
  private static instance: OrderModel;
  private orders: Order[] = [];

  private constructor() {}

  public static getInstance(): OrderModel {
    if (!OrderModel.instance) {
      OrderModel.instance = new OrderModel();
    }
    return OrderModel.instance;
  }

  public createOrder(tableId?: string): Order {
    const cartModel = CartModel.getInstance();
    const cartItems = cartModel.getItems();
    
    // 转换购物车项为订单项
    const orderItems: OrderItem[] = cartItems.map(item => new OrderItem(item));

    const order: Order = {
      id: Math.floor(100000 + Math.random() * 900000).toString(), // 6位随机数
      items: orderItems,
      totalAmount: cartModel.getTotalAmount(),
      status: 'completed',
      createTime: new Date().toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      }),
      tableId
    };

    this.orders.unshift(order); // 新订单添加到最前面
    return order;
  }

  public getOrders(): Order[] {
    return this.orders;
  }

  public getOrderById(orderId: string): Order | undefined {
    return this.orders.find(o => o.id === orderId);
  }

  public updateOrderStatus(orderId: string, status: OrderStatus): void {
    const order = this.orders.find(o => o.id === orderId);
    if (order) {
      order.status = status;
    }
  }

  public clearCart(): void {
    const cartModel = CartModel.getInstance();
    cartModel.clearCart();
  }
} 