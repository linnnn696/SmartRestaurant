import router from '@ohos.router';
import { CartModel } from '../model/DishModel';
import { OrderModel } from '../model/OrderModel';
import promptAction from '@ohos.promptAction';

interface RouterParams {
  activeTab: number;
  newOrderId: string;
}

const PAYMENT_DELAY = 1500;
const TOAST_DURATION = 1000;
const NAVIGATION_DELAY = 1000;

@Entry
@Component
struct PaymentPage {
  @State selectedPayment: string = '';
  private cartModel: CartModel = CartModel.getInstance();
  private orderModel: OrderModel = OrderModel.getInstance();
  @State totalAmount: number = 0;

  aboutToAppear() {
    this.totalAmount = this.cartModel.getTotalAmount();
  }

  async handlePayment() {
    if (!this.selectedPayment) {
      promptAction.showToast({ message: '请选择支付方式' });
      return;
    }

    try {
      // 创建订单（在支付前就创建，这样可以显示待支付状态）
      const order = this.orderModel.createOrder();

      // 显示支付中状态
      promptAction.showToast({ 
        message: `正在跳转${this.selectedPayment === 'alipay' ? '支付宝' : '微信'}支付...`,
        duration: TOAST_DURATION
      });

      // 模拟支付过程
      await new Promise<void>((resolve) => setTimeout(resolve, PAYMENT_DELAY));
      
      // 更新订单状态为处理中
      this.orderModel.updateOrderStatus(order.id, 'processing');
      // 清空购物车
      this.orderModel.clearCart();

      promptAction.showToast({ 
        message: '支付成功！',
        duration: TOAST_DURATION
      });

      // 延迟跳转到订单页面
      setTimeout(() => {
        // 返回到主页面并切换到订单标签
        router.pushUrl({
          url: 'pages/MainPage',
          params: {
            activeTab: 1,
            newOrderId: order.id
          }
        });
      }, NAVIGATION_DELAY);
    } catch (error) {
      promptAction.showToast({ 
        message: '支付失败，请重试',
        duration: TOAST_DURATION
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

        // TODO: 需要添加支付宝和微信支付的图标资源
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
        .backgroundColor(this.selectedPayment ? '#2D7AF6' : '#CCCCCC')
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