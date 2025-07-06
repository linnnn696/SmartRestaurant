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

export interface CategoryItem {
  id: string;
  name: string;
  icon: string;
}

export const DISH_CATEGORIES: CategoryItem[] = [
  { id: 'hot', name: '热菜', icon: '🔥' },
  { id: 'cold', name: '凉菜', icon: '❄️' },
  { id: 'staple', name: '主食', icon: '🍚' },
  { id: 'soup', name: '汤品', icon: '🥣' },
  { id: 'drink', name: '饮品', icon: '🥤' }
];

export class CartItem {
  dishId: string;
  quantity: number;

  constructor(dishId: string, quantity: number = 1) {
    this.dishId = dishId;
    this.quantity = quantity;
  }
}

export const SAMPLE_DISHES: DishItem[] = [
  // 热菜
  {
    id: '1',  // 宫保鸡丁
    name: '宫保鸡丁',
    price: 38.00,
    description: '经典川菜，口感麻辣鲜香',
    image: $r('app.media.gongbao_chicken'),
    category: '热菜',
    tag: '招牌',
    sales: 238
  },
  {
    id: '2',  // 水煮鱼片
    name: '水煮鱼片',
    price: 58.00,
    description: '新鲜草鱼片，麻辣鲜香',
    image: $r('app.media.fish_dish'),
    category: '热菜',
    tag: '特色',
    sales: 186
  },
  {
    id: '3',  // 北京烤鸭
    name: '北京烤鸭',
    price: 108.00,
    description: '外酥里嫩，搭配特制酱料',
    image: $r('app.media.roasted_duck'),
    category: '热菜',
    tag: '推荐',
    sales: 156
  },
  {
    id: '4',  // 蒜蓉粉丝扇贝
    name: '蒜蓉粉丝扇贝',
    price: 48.00,
    description: '新鲜扇贝，蒜香浓郁',
    image: $r('app.media.scallop_dish'),
    category: '热菜',
    tag: '新品',
    sales: 92
  },
  {
    id: '5',  // 青椒炒肉
    name: '青椒炒肉',
    price: 32.00,
    description: '农家小炒，下饭首选',
    image: $r('app.media.pork_dish'),
    category: '热菜',
    sales: 165
  },
  {
    id: '6',  // 素炒什锦
    name: '素炒什锦',
    price: 28.00,
    description: '营养搭配，清淡爽口',
    image: $r('app.media.mixed_veggies'),
    category: '热菜',
    sales: 145
  },
  {
    id: '7',  // 鱼香肉丝
    name: '鱼香肉丝',
    price: 36.00,
    description: '传统川菜，酸甜可口',
    image: $r('app.media.yuxiang_pork'),
    category: '热菜',
    tag: '特色',
    sales: 198
  },
  {
    id: '8',  // 麻婆豆腐
    name: '麻婆豆腐',
    price: 28.00,
    description: '川菜代表，麻辣鲜香',
    image: $r('app.media.mapo_tofu'),
    category: '热菜',
    tag: '推荐',
    sales: 178
  },

  // 凉菜
  {
    id: '9',  // 凉拌黄瓜
    name: '凉拌黄瓜',
    price: 18.00,
    description: '清脆爽口，开胃解腻',
    image: $r('app.media.cucumber_salad'),
    category: '凉菜',
    sales: 135
  },
  {
    id: '10',  // 凉拌木耳
    name: '凉拌木耳',
    price: 22.00,
    description: '爽滑可口，营养丰富',
    image: $r('app.media.black_fungus'),
    category: '凉菜',
    sales: 122
  },
  {
    id: '11',  // 口水鸡
    name: '口水鸡',
    price: 36.00,
    description: '川式凉菜，麻辣爽口',
    image: $r('app.media.saliva_chicken'),
    category: '凉菜',
    tag: '特色',
    sales: 168
  },
  {
    id: '12',  // 白切鸡
    name: '白切鸡',
    price: 48.00,
    description: '鲜嫩多汁，配姜葱酱',
    image: $r('app.media.white_cut_chicken'),
    category: '凉菜',
    tag: '推荐',
    sales: 145
  },
  {
    id: '13',  // 皮蛋豆腐
    name: '皮蛋豆腐',
    price: 22.00,
    description: '经典搭配，营养美味',
    image: $r('app.media.tofu_egg'),
    category: '凉菜',
    sales: 156
  },

  // 主食
  {
    id: '14',  // 扬州炒饭
    name: '扬州炒饭',
    price: 28.00,
    description: '色香味俱全，料足味美',
    image: $r('app.media.yangzhou_rice'),
    category: '主食',
    tag: '招牌',
    sales: 245
  },
  {
    id: '15',  // 阳春面
    name: '阳春面',
    price: 18.00,
    description: '汤鲜面滑，经典好味',
    image: $r('app.media.plain_noodles'),
    category: '主食',
    sales: 178
  },
  {
    id: '16',  // 蒸包子
    name: '蒸包子',
    price: 12.00,
    description: '皮薄馅大，现蒸现卖',
    image: $r('app.media.steamed_bun'),
    category: '主食',
    sales: 198
  },
  {
    id: '17',  // 和牛炒饭
    name: '和牛炒饭',
    price: 88.00,
    description: '顶级食材，入口即化',
    image: $r('app.media.wagyu_rice'),
    category: '主食',
    tag: '新品',
    sales: 68
  },
  {
    id: '18',  // 松露炒饭
    name: '松露炒饭',
    price: 48.00,
    description: '奢华新品，松露飘香',
    image: $r('app.media.truffle_rice'),
    category: '主食',
    tag: '新品',
    sales: 86
  },
  {
    id: '19',  // 蛋炒饭
    name: '蛋炒饭',
    price: 16.00,
    description: '粒粒分明，香气扑鼻',
    image: $r('app.media.egg_rice'),
    category: '主食',
    tag: '推荐',
    sales: 256
  },

  // 汤品
  {
    id: '20',  // 例汤
    name: '例汤',
    price: 8.00,
    description: '每日新鲜熬制，滋补养生',
    image: $r('app.media.soup_dish'),
    category: '汤品',
    sales: 320
  },
  {
    id: '21',  // 番茄蛋汤
    name: '番茄蛋汤',
    price: 20.00,
    description: '家常美味，营养健康',
    image: $r('app.media.tomato_soup'),
    category: '汤品',
    sales: 168
  },
  {
    id: '22',  // 紫菜蛋花汤
    name: '紫菜蛋花汤',
    price: 20.00,
    description: '清淡养生，开胃暖身',
    image: $r('app.media.seaweed_soup'),
    category: '汤品',
    sales: 145
  },

  // 饮品
  {
    id: '23',  // 柠檬水
    name: '柠檬水',
    price: 12.00,
    description: '清新柠檬，冰镇提神',
    image: $r('app.media.lemon_water'),
    category: '饮品',
    sales: 178
  },
  {
    id: '24',  // 茉莉花茶
    name: '茉莉花茶',
    price: 8.00,
    description: '茉莉飘香，回甘悠长',
    image: $r('app.media.jasmine_tea'),
    category: '饮品',
    sales: 156
  },
  {
    id: '25',  // 雪碧
    name: '雪碧',
    price: 6.00,
    description: '冰镇雪碧，透心凉',
    image: $r('app.media.sprite'),
    category: '饮品',
    sales: 198
  },
  {
    id: '26',  // 可乐
    name: '可乐',
    price: 6.00,
    description: '冰镇可乐，畅快爽口',
    image: $r('app.media.cola'),
    category: '饮品',
    sales: 245
  }
];

export class CartModel {
  private static instance: CartModel;
  private items: Map<string, CartItem>;

  private constructor() {
    this.items = new Map<string, CartItem>();
  }

  static getInstance(): CartModel {
    if (!CartModel.instance) {
      CartModel.instance = new CartModel();
    }
    return CartModel.instance;
  }

  addToCart(dishId: string): void {
    // 先验证菜品是否存在
    const dish = SAMPLE_DISHES.find(d => d.id === dishId);
    if (!dish) {
      console.error('添加到购物车失败：找不到菜品', dishId);
      return;
    }

    const item = this.items.get(dishId);
    if (item) {
      item.quantity += 1;
    } else {
      this.items.set(dishId, new CartItem(dishId));
    }
    eventBus.emit('cart-updated');
  }

  removeFromCart(dishId: string): void {
    // 先验证菜品是否存在
    const dish = SAMPLE_DISHES.find(d => d.id === dishId);
    if (!dish) {
      console.error('从购物车移除失败：找不到菜品', dishId);
      return;
    }

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

  getItemCount(dishId: string): number {
    const item = this.items.get(dishId);
    return item ? item.quantity : 0;
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
      } else {
        console.error('计算总价失败：找不到菜品', item.dishId);
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