export type ResourceStr = Resource | string;

// 定义事件数据类型
interface CartEventData {
  type: 'cart-updated';
}

type EventData = CartEventData | void;
type EventCallback = (data?: EventData) => void;

// 添加事件总线类
class EventBus {
  private static instance: EventBus;
  private listeners: Map<string, EventCallback[]>;

  private constructor() {
    this.listeners = new Map<string, EventCallback[]>();
  }

  static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
  }

  on(event: string, callback: EventCallback): void {
    const callbacks = this.listeners.get(event) || [];
    if (!this.listeners.has(event)) {
      this.listeners.set(event, callbacks);
    }
    callbacks.push(callback);
  }

  off(event: string, callback: EventCallback): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  emit(event: string, data?: EventData): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach((callback: EventCallback) => callback(data));
    }
  }
}

export const eventBus = EventBus.getInstance();

export interface DishItem {
  id: number;
  name: string;
  price: number;
  description: string;
  image: ResourceStr;
  category: string;
  sales?: number;
  isSpicy?: boolean;
  tag?: string;
}

export interface CategoryItem {
  id: string;
  name: string;
  icon: string;
}

export const DISH_CATEGORIES: CategoryItem[] = [
  { id: 'hot', name: '热菜', icon: '🔥' },
  { id: 'cold', name: '凉菜', icon: '❄️' },
  { id: 'staple', name: '主食', icon: '🍚' },
  { id: 'soup', name: '汤类', icon: '🥣' },
  { id: 'drink', name: '饮品', icon: '🥤' }
];

export class CartItem {
  dishId: number;
  quantity: number;

  constructor(dishId: number, quantity: number = 1) {
    this.dishId = dishId;
    this.quantity = quantity;
  }
}

export const SAMPLE_DISHES: DishItem[] = [
  {
    id: 1,
    name: '宫保鸡丁',
    price: 38.00,
    description: '经典川菜，口感麻辣鲜香',
    image: $r('app.media.dish_kungpao'),
    category: '热菜',
    sales: 100,
    isSpicy: true,
    tag: '招牌'
  },
  {
    id: 2,
    name: '水煮鱼片',
    price: 58.00,
    description: '新鲜草鱼片，麻辣鲜香',
    image: $r('app.media.dish_fish'),
    category: '热菜',
    sales: 88,
    isSpicy: true,
    tag: '特色'
  },
  {
    id: 3,
    name: '北京烤鸭',
    price: 108.00,
    description: '外酥里嫩，搭配特制酱料',
    image: $r('app.media.dish_duck'),
    category: '热菜',
    sales: 50,
    tag: '推荐'
  },
  {
    id: 4,
    name: '蒜蓉粉丝扇贝',
    price: 48.00,
    description: '新鲜扇贝，蒜香浓郁',
    image: $r('app.media.dish_scallop'),
    category: '热菜',
    sales: 45,
    tag: '新品'
  },
  {
    id: 5,
    name: '青椒炒肉',
    price: 32.00,
    description: '农家小炒，下饭首选',
    image: $r('app.media.dish_pork'),
    category: '热菜',
    sales: 80
  },
  {
    id: 6,
    name: '凉拌黄瓜',
    price: 18.00,
    description: '清脆爽口，开胃解腻',
    image: '#90EE90',
    category: '凉菜',
    sales: 60
  },
  {
    id: 7,
    name: '凉拌木耳',
    price: 22.00,
    description: '爽滑可口，营养丰富',
    image: '#2F4F4F',
    category: '凉菜',
    sales: 40
  },
  {
    id: 8,
    name: '白切鸡',
    price: 48.00,
    description: '鲜嫩多汁，配姜葱酱',
    image: '#F5DEB3',
    category: '凉菜',
    sales: 75
  },
  {
    id: 9,
    name: '扬州炒饭',
    price: 28.00,
    description: '色香味俱全，料足味美',
    image: '#FFE4B5',
    category: '主食',
    sales: 120
  },
  {
    id: 10,
    name: '阳春面',
    price: 18.00,
    description: '汤鲜面滑，经典好味',
    image: '#FFF8DC',
    category: '主食',
    sales: 90
  },
  {
    id: 11,
    name: '蒸饺',
    price: 25.00,
    description: '皮薄馅大，鲜香可口',
    image: '#F0F8FF',
    category: '主食',
    sales: 85
  },
  {
    id: 12,
    name: '西湖牛肉羹',
    price: 32.00,
    description: '浓郁鲜美，营养丰富',
    image: '#8B4513',
    category: '汤类',
    sales: 55
  },
  {
    id: 13,
    name: '紫菜蛋花汤',
    price: 20.00,
    description: '清淡爽口，开胃解腻',
    image: '#556B2F',
    category: '汤类',
    sales: 70
  },
  {
    id: 14,
    name: '酸梅汤',
    price: 15.00,
    description: '酸甜可口，解暑降火',
    image: $r('app.media.dish_soup'),
    category: '饮品',
    sales: 100,
    tag: '推荐'
  },
  {
    id: 15,
    name: '柠檬蜂蜜水',
    price: 18.00,
    description: '清新润喉，美容养颜',
    image: $r('app.media.dish_soup'),
    category: '饮品',
    sales: 80
  },
  {
    id: 16,
    name: '芒果汁',
    price: 16.00,
    description: '新鲜芒果制作，香甜可口',
    image: $r('app.media.dish_soup'),
    category: '饮品',
    sales: 90,
    tag: '新品'
  },
  {
    id: 17,
    name: '珍珠奶茶',
    price: 18.00,
    description: '香浓奶茶，弹性珍珠',
    image: $r('app.media.dish_soup'),
    category: '饮品',
    sales: 120,
    tag: '热销'
  }
];

export class CartModel {
  private static instance: CartModel;
  private items: Map<number, CartItem> = new Map();

  private constructor() {}

  static getInstance(): CartModel {
    if (!CartModel.instance) {
      CartModel.instance = new CartModel();
    }
    return CartModel.instance;
  }

  addToCart(dishId: number): void {
    const item = this.items.get(dishId);
    if (item) {
      item.quantity += 1;
    } else {
      this.items.set(dishId, new CartItem(dishId));
    }
    eventBus.emit('cart-updated');
  }

  removeFromCart(dishId: number): void {
    const item = this.items.get(dishId);
    if (item) {
      if (item.quantity > 1) {
        item.quantity -= 1;
      } else {
        this.items.delete(dishId);
      }
      eventBus.emit('cart-updated');
    }
  }

  getItemCount(dishId: number): number {
    return this.items.get(dishId)?.quantity || 0;
  }

  getTotalCount(): number {
    let total = 0;
    this.items.forEach(item => total += item.quantity);
    return total;
  }

  getTotalAmount(): number {
    let total = 0;
    this.items.forEach(item => {
      const dish = SAMPLE_DISHES.find(d => d.id === item.dishId);
      if (dish) {
        total += dish.price * item.quantity;
      }
    });
    return total;
  }

  getItems(): CartItem[] {
    return Array.from(this.items.values());
  }

  clearCart(): void {
    this.items.clear();
    eventBus.emit('cart-updated');
  }
} 