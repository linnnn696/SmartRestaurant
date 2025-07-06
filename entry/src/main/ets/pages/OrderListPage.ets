import router from '@ohos.router';
import promptAction from '@ohos.promptAction';
import { OrderService, OrderItem, Order, OrderStatus } from '../service/OrderService';

interface RouterParams {
  newOrderId?: string;
  shouldRefresh?: boolean;
}

@Component
export struct OrderListPage {
  @State orders: Order[] = [];
  @State isLoading: boolean = false;
  @State newOrderId: string = '';
  @State errorMessage: string = '';

  aboutToAppear() {
    // 获取路由参数，检查是否有新订单
    const params = router.getParams() as RouterParams;
    if (params?.newOrderId) {
      this.newOrderId = params.newOrderId;
    }
    // 加载订单列表
    this.loadOrders();
  }

  async loadOrders() {
    if (this.isLoading) return;

    try {
      this.isLoading = true;
      this.errorMessage = '';
      
      const orderList = await OrderService.getAllOrders();
      if (!Array.isArray(orderList)) {
        throw new Error('返回的订单数据格式无效');
      }
      
      this.orders = orderList;

      // 如果有新订单ID，3秒后清除高亮效果
      if (this.newOrderId) {
        setTimeout(() => {
          this.newOrderId = '';
        }, 3000);
      }
    } catch (error) {
      console.error('加载订单失败:', error);
      this.errorMessage = '加载订单失败，请下拉刷新重试';
      promptAction.showToast({
        message: this.errorMessage,
        duration: 2000
      });
    } finally {
      this.isLoading = false;
    }
  }

  build() {
    Column() {
      // 顶部栏
      Row() {
        Text('我的订单')
          .fontSize(20)
          .fontWeight(FontWeight.Bold)
      }
      .width('100%')
      .height(56)
      .padding({ left: 16, right: 16 })
      .backgroundColor(Color.White)

      Refresh({ refreshing: $$this.isLoading }) {
        // 加载中状态
        if (this.isLoading && this.orders.length === 0) {
          Column() {
            LoadingProgress()
              .width(32)
              .height(32)
            Text('加载中...')
              .fontSize(14)
              .fontColor('#999999')
              .margin({ top: 8 })
          }
          .width('100%')
          .layoutWeight(1)
          .justifyContent(FlexAlign.Center)
        }
        // 错误状态
        else if (this.errorMessage && this.orders.length === 0) {
          Column() {
            Image($r('app.media.order'))
              .width(120)
              .height(120)
              .fillColor('#CCCCCC')
              .margin({ bottom: 16 })
            Text(this.errorMessage)
              .fontSize(16)
              .fontColor('#999999')
            Button('重试')
              .onClick(() => this.loadOrders())
              .margin({ top: 16 })
          }
          .width('100%')
          .layoutWeight(1)
          .justifyContent(FlexAlign.Center)
        }
        // 空状态
        else if (this.orders.length === 0) {
          Column() {
            Image($r('app.media.order'))
              .width(120)
              .height(120)
              .fillColor('#CCCCCC')
              .margin({ bottom: 16 })
            Text('暂无订单')
              .fontSize(16)
              .fontColor('#999999')
          }
          .width('100%')
          .layoutWeight(1)
          .justifyContent(FlexAlign.Center)
        }
        // 订单列表
        else {
          List({ space: 12 }) {
            ForEach(this.orders, (order: Order) => {
              ListItem() {
                this.OrderItem(order)
              }
              .backgroundColor(order.id === this.newOrderId ? '#FFF0F4' : Color.White)
              .animation({
                duration: 300,
                curve: Curve.EaseOut
              })
            }, (order: Order) => order.id)
          }
          .width('100%')
          .layoutWeight(1)
          .padding({ left: 16, right: 16, top: 12 })
        }
      }
      .width('100%')
      .layoutWeight(1)
      .onStateChange((refreshStatus: RefreshStatus) => {
        if (refreshStatus === RefreshStatus.Refresh) {
          this.loadOrders();
        }
      })
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#F5F5F5')
  }

  @Builder
  OrderStatusTag(status: OrderStatus) {
    Text(status === OrderStatus.COMPLETED ? '已完成' : '制作中')
      .fontSize(12)
      .fontColor(status === OrderStatus.COMPLETED ? '#52C41A' : '#FF6B6B')
      .backgroundColor(status === OrderStatus.COMPLETED ? '#F0F9EB' : '#FFF0F0')
      .padding({ left: 8, right: 8, top: 4, bottom: 4 })
      .borderRadius(4)
  }

  @Builder
  OrderItemRow(item: OrderItem) {
    Row() {
      Text(item.name)
        .fontSize(14)
        .fontColor('#333333')
      Row() {
        Text(`x${item.quantity}`)
          .fontSize(14)
          .fontColor('#666666')
          .margin({ right: 8 })
        Text(`¥${(item.price * item.quantity).toFixed(2)}`)
          .fontSize(14)
          .fontColor('#FF6B6B')
      }
    }
    .width('100%')
    .justifyContent(FlexAlign.SpaceBetween)
    .margin({ bottom: 8 })
  }

  @Builder
  OrderItem(order: Order) {
    Column() {
      Row() {
        Text(`订单号：${order.id}`)
          .fontSize(14)
          .fontColor('#666666')
        Text(this.getStatusText(order.status))
          .fontSize(14)
          .fontColor(this.getStatusColor(order.status))
      }
      .width('100%')
      .justifyContent(FlexAlign.SpaceBetween)
      .margin({ bottom: 12 })

      // 订单商品列表
      Column() {
        if (Array.isArray(order.items) && order.items.length > 0) {
          ForEach(order.items, (item: OrderItem) => {
            this.OrderItemRow(item)
          })
        } else {
          Text('暂无商品信息')
            .fontSize(14)
            .fontColor('#999999')
        }
      }
      .width('100%')
      .margin({ bottom: 12 })

      Divider()
        .color('#EEEEEE')
        .margin({ bottom: 12 })

      Row() {
        Text(`下单时间：${order.createdAt || '未知'}`)
          .fontSize(14)
          .fontColor('#666666')
      }
      .margin({ bottom: 8 })

      Row() {
        Text(`共${order.items?.reduce((sum: number, item: OrderItem) => sum + item.quantity, 0) || 0}件商品`)
          .fontSize(14)
          .fontColor('#666666')
        Text(`合计：¥${order.items?.reduce((sum: number, item: OrderItem) => sum + (item.price * item.quantity), 0).toFixed(2) || '0.00'}`)
          .fontSize(16)
          .fontColor('#FF6B6B')
          .fontWeight(FontWeight.Bold)
      }
      .width('100%')
      .justifyContent(FlexAlign.SpaceBetween)
    }
    .width('100%')
    .padding(16)
    .backgroundColor(this.newOrderId === order.id ? '#FFF0F0' : Color.White)
    .borderRadius(12)
    .margin({ bottom: 12 })
    .onClick(() => {
      try {
        router.pushUrl({
          url: 'pages/OrderTrackPage',
          params: { orderId: order.id }
        }).catch((error: Error) => {
          console.error('导航到订单跟踪页面失败:', error);
          promptAction.showToast({
            message: '页面跳转失败',
            duration: 2000
          });
        });
      } catch (error) {
        console.error('导航错误:', error);
      }
    })
  }

  // 获取状态文本
  private getStatusText(status: OrderStatus): string {
    return status === OrderStatus.COMPLETED ? '已完成' : '制作中';
  }

  // 获取状态颜色
  private getStatusColor(status: OrderStatus): string {
    return status === OrderStatus.COMPLETED ? '#52C41A' : '#FF6B6B';
  }
} 