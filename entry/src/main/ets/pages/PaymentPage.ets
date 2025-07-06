import router from '@ohos.router';
import { CartModel } from '../model/DishModel';
import { OrderModel } from '../model/OrderModel';
import { OrderService, OrderItem, OrderStatus } from '../service/OrderService';
import { MenuService, MenuItem } from '../service/MenuService';
import promptAction from '@ohos.promptAction';

interface RouterParams {
  amount: number;
}

const PAYMENT_DELAY = 1000;

@Entry
@Component
struct PaymentPage {
  @State selectedPayment: string = '';
  @State dishes: Map<string, MenuItem> = new Map();
  private cartModel: CartModel = CartModel.getInstance();
  private orderModel: OrderModel = OrderModel.getInstance();
  @State totalAmount: number = 0;

  async aboutToAppear() {
    // 获取路由参数
    const params = router.getParams() as RouterParams;
    this.totalAmount = params?.amount || 0;

    // 获取菜品数据
    const allDishes = await MenuService.getAllMenuItems();
    this.dishes = new Map(allDishes.map(dish => [dish.id, dish]));
  }

  async handlePayment() {
    if (!this.selectedPayment) {
      promptAction.showToast({ message: '请选择支付方式' });
      return;
    }

    try {
      // 显示处理中状态
      promptAction.showToast({ 
        message: '支付处理中...',
        duration: 1000
      });

      // 准备订单数据
      console.info('[PaymentPage] 开始准备订单数据');
      const cartItems = this.cartModel.getItems();
      if (!cartItems || cartItems.length === 0) {
        throw new Error('购物车为空，请先添加商品');
      }
      console.info('[PaymentPage] 购物车商品:', JSON.stringify(cartItems));

      // 检查菜品信息是否完整
      console.info('[PaymentPage] 检查菜品信息');
      if (this.dishes.size === 0) {
        throw new Error('菜品数据加载失败，请重试');
      }
      console.info('[PaymentPage] 当前菜品列表:', JSON.stringify(Array.from(this.dishes.entries())));
      
      const orderItems: OrderItem[] = [];
      for (const item of cartItems) {
        const dish = this.dishes.get(item.dishId);
        console.info(`[PaymentPage] 处理菜品 ${item.dishId}:`, JSON.stringify(dish));
        
        if (!dish) {
          console.error(`[PaymentPage] 找不到菜品信息: ${item.dishId}`);
          throw new Error(`菜品信息不完整，请重新选择`);
        }

        if (!item.quantity || item.quantity <= 0) {
          throw new Error(`商品 ${dish.name} 的数量无效`);
        }

        if (!dish.price || dish.price <= 0) {
          throw new Error(`商品 ${dish.name} 的价格无效`);
        }
        
        orderItems.push({
          menuItemId: item.dishId,
          name: dish.name,
          price: dish.price,
          quantity: item.quantity
      });
      }
      console.info('[PaymentPage] 准备的订单项:', JSON.stringify(orderItems));

      // 创建订单
      console.info('[PaymentPage] 开始创建订单');
      const order = await OrderService.createOrder(orderItems, "1", OrderStatus.PREPARING);
      console.info('[PaymentPage] 订单创建成功:', JSON.stringify(order));
      
      // 清空购物车
      this.cartModel.clearCart();
      console.info('[PaymentPage] 购物车已清空');

      // 显示成功提示
      promptAction.showToast({ 
        message: '支付成功！',
        duration: 1000
      });

      // 清空页面栈并跳转到订单列表
      setTimeout(() => {
        console.info('[PaymentPage] 准备跳转到订单列表');
        router.clear();
        router.pushUrl({
          url: 'pages/MainPage',
          params: {
            activeTab: 1,
            newOrderId: order.id
          }
        });
      }, PAYMENT_DELAY);
    } catch (error) {
      console.error('[PaymentPage] 支付过程出错:', error);
      let errorMessage = '支付失败，请重试';
      
      if (error instanceof Error) {
        // 根据错误类型显示不同的提示信息
        if (error.message.includes('购物车为空')) {
          errorMessage = '购物车为空，请先添加商品';
        } else if (error.message.includes('菜品数据加载失败')) {
          errorMessage = '菜品数据加载失败，请重试';
        } else if (error.message.includes('菜品信息不完整')) {
          errorMessage = '菜品信息不完整，请重新选择';
        } else if (error.message.includes('数量无效')) {
          errorMessage = error.message;
        } else if (error.message.includes('价格无效')) {
          errorMessage = error.message;
        } else if (error.message.includes('订单数据格式错误')) {
          errorMessage = '订单数据格式错误，请重试';
        } else if (error.message.includes('服务器响应为空')) {
          errorMessage = '网络异常，请重试';
        } else if (error.message.includes('订单ID为空')) {
          errorMessage = '创建订单失败，请重试';
        } else {
          errorMessage = '支付失败：' + error.message;
        }
      }

      promptAction.showToast({ 
        message: errorMessage,
        duration: 3000
      });
    }
  }

  @Builder
  PaymentMethodItem(icon: Resource, name: string, id: string) {
    Row() {
      Row() {
        Image(icon)
          .width(40)
          .height(40)
          .objectFit(ImageFit.Contain)
          .margin({ right: 16 })
        Column() {
          Text(name)
            .fontSize(16)
            .fontWeight(FontWeight.Medium)
          Text(id === 'alipay' ? '推荐使用支付宝支付' : '推荐使用微信支付')
            .fontSize(12)
            .fontColor('#999999')
            .margin({ top: 4 })
        }
      }
      .layoutWeight(1)

      Radio({ value: id, group: 'payment' })
        .checked(this.selectedPayment === id)
        .onChange((isChecked: boolean) => {
          if (isChecked) {
            this.selectedPayment = id;
          }
        })
    }
    .width('100%')
    .height(80)
    .padding({ left: 20, right: 20 })
    .backgroundColor(Color.White)
    .borderRadius(16)
    .margin({ bottom: 12 })
    .onClick(() => {
      this.selectedPayment = id;
    })
  }

  build() {
    Column() {
      // 顶部栏
      Row() {
        Button() {
          Image($r('app.media.ic_back'))
            .width(24)
            .height(24)
        }
        .backgroundColor('transparent')
        .onClick(() => router.back())

        Text('支付')
          .fontSize(20)
          .fontWeight(FontWeight.Bold)
          .margin({ left: 16 })
      }
      .width('100%')
      .height(56)
      .padding({ left: 16, right: 16 })
      .backgroundColor(Color.White)

      // 支付金额展示
      Column() {
        Text('支付金额')
          .fontSize(16)
          .fontColor('#666666')
          .margin({ bottom: 8 })
        Text(`¥${this.totalAmount.toFixed(2)}`)
          .fontSize(36)
          .fontWeight(FontWeight.Bold)
          .fontColor('#333333')
      }
      .width('100%')
      .padding({ top: 24, bottom: 24, left: 20, right: 20 })
      .margin({ top: 12 })
      .backgroundColor(Color.White)
      .borderRadius(16)

      // 支付方式选择
      Column() {
        Text('选择支付方式')
          .fontSize(16)
          .fontColor('#666666')
          .alignSelf(ItemAlign.Start)
          .margin({ bottom: 16 })

        this.PaymentMethodItem($r('app.media.ic_alipay'), '支付宝支付', 'alipay')
        this.PaymentMethodItem($r('app.media.ic_wechat'), '微信支付', 'wechat')
      }
      .width('100%')
      .padding(20)
      .margin({ top: 12 })
      .backgroundColor(Color.White)
      .borderRadius(16)

      // 底部确认按钮
      Button('确认支付')
        .width('90%')
        .height(50)
        .fontSize(18)
        .fontWeight(FontWeight.Medium)
        .backgroundColor(this.selectedPayment ? '#FF4081' : '#CCCCCC')
        .enabled(this.selectedPayment !== '')
        .margin({ top: 32 })
        .onClick(() => {
          this.handlePayment();
        })
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#F5F5F5')
  }
} 