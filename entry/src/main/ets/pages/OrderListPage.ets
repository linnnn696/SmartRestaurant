import router from '@ohos.router';
import { OrderModel, Order, OrderItem, OrderStatus } from '../model/OrderModel';
import { CartItem, DishItem, SAMPLE_DISHES } from '../model/DishModel';

interface RouterParams {
  newOrderId?: string;
}

@Component
export struct OrderListPage {
  @State orders: Order[] = [];
  @State currentIndex: number = 1;  // 当前选中的是订单页面
  private orderModel: OrderModel = OrderModel.getInstance();
  @State newOrderId: string = '';

  aboutToAppear() {
    this.refreshOrders();
  }

  onPageShow() {
    // 每次页面显示时刷新订单列表
    this.refreshOrders();
  }

  refreshOrders() {
    // 获取所有订单
    this.orders = this.orderModel.getOrders();
    
    // 获取路由参数中的新订单ID
    const params = router.getParams() as RouterParams;
    if (params?.newOrderId) {
      this.newOrderId = params.newOrderId;
      // 3秒后清除高亮效果
      setTimeout(() => {
        this.newOrderId = '';
      }, 3000);
    }
  }

  getDish(dishId: number): DishItem | undefined {
    return SAMPLE_DISHES.find(dish => dish.id === dishId);
  }

  @Builder
  OrderStatusTag(status: OrderStatus) {
    Text(status === 'pending' ? '待处理' :
         status === 'processing' ? '进行中' :
         status === 'completed' ? '已完成' : '已取消')
      .fontSize(12)
      .fontColor(status === 'processing' ? '#FF6B6B' :
                 status === 'completed' ? '#67C23A' :
                 status === 'cancelled' ? '#909399' : '#E6A23C')
      .backgroundColor(status === 'processing' ? '#FFF0F0' :
                      status === 'completed' ? '#F0F9EB' :
                      status === 'cancelled' ? '#F4F4F5' : '#FDF6EC')
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

  getStatusText(status: OrderStatus): string {
    switch (status) {
      case 'pending':
        return '待支付';
      case 'processing':
        return '制作中';
      case 'completed':
        return '已完成';
      case 'cancelled':
        return '已取消';
      default:
        return '未知状态';
    }
  }

  getStatusColor(status: OrderStatus): string {
    switch (status) {
      case 'processing':
        return '#FF6B6B';
      case 'completed':
        return '#52C41A';
      case 'cancelled':
        return '#999999';
      case 'pending':
        return '#FF9500';
      default:
        return '#999999';
    }
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
        ForEach(order.items, (item: OrderItem) => {
          this.OrderItemRow(item)
        })
      }
      .width('100%')
      .margin({ bottom: 12 })

      Divider()
        .color('#EEEEEE')
        .margin({ bottom: 12 })

      Row() {
        Text(`下单时间：${order.createTime}`)
          .fontSize(14)
          .fontColor('#666666')
      }
      .margin({ bottom: 8 })

      Row() {
        Text(`共${order.items.reduce((sum, item) => sum + item.quantity, 0)}件商品`)
          .fontSize(14)
          .fontColor('#666666')
        Text(`合计：¥${order.totalAmount.toFixed(2)}`)
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
  }

  @Builder BottomTabs() {
    Row() {
      Column() {
        Image($r('app.media.scan'))
          .width(24)
          .height(24)
        Text('点餐')
          .fontSize(12)
          .margin({ top: 4 })
          .fontColor(this.currentIndex === 0 ? '#FF4081' : '#999999')
      }
      .onClick(() => {
        router.replaceUrl({ url: 'pages/HomePage' });
      })

      Column() {
        Image($r('app.media.order'))
          .width(24)
          .height(24)
        Text('我的订单')
          .fontSize(12)
          .margin({ top: 4 })
          .fontColor(this.currentIndex === 1 ? '#FF4081' : '#999999')
      }
      .onClick(() => {
        // 已经在订单页面，不需要操作
      })

      Column() {
        Image($r('app.media.profile'))
          .width(24)
          .height(24)
        Text('个人中心')
          .fontSize(12)
          .margin({ top: 4 })
          .fontColor(this.currentIndex === 2 ? '#FF4081' : '#999999')
      }
      .onClick(() => {
        router.replaceUrl({ url: 'pages/ProfilePage' });
      })
    }
    .width('100%')
    .height(56)
    .justifyContent(FlexAlign.SpaceEvenly)
    .backgroundColor(Color.White)
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

      if (this.orders.length === 0) {
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
      } else {
        List() {
          ForEach(this.orders, (order: Order) => {
            ListItem() {
              this.OrderItem(order)
            }
          })
        }
        .width('100%')
        .layoutWeight(1)
        .padding({ left: 16, right: 16, top: 12 })
      }
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#F5F5F5')
  }
} 