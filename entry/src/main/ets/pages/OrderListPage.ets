import router from '@ohos.router';
import promptAction from '@ohos.promptAction';
import { OrderService, OrderItem, Order, OrderStatus } from '../service/OrderService';

interface RouterParams {
  newOrderId?: number;
}

@Component
export struct OrderListPage {
  @State orders: Order[] = [];
  @State currentIndex: number = 1;
  @State isLoading: boolean = false;
  @State newOrderId: number = 0;
  @State errorMessage: string = '';
  @State isRefreshing: boolean = false;

  aboutToAppear(): void {
    // 首次加载订单
    this.loadOrders();
  }

  onPageShow(): void {
    // 页面显示时立即刷新一次
    this.loadOrders();
  }

  async loadOrders(): Promise<void> {
    // 如果正在加载中，不重复加载
    if (this.isLoading) {
      return;
    }

    try {
      this.isLoading = true;
      this.errorMessage = '';
      
      // 从后端获取订单列表
      const orderList = await OrderService.getAllOrders();
      
      // 检查返回数据的有效性
      if (!Array.isArray(orderList)) {
        throw new Error('返回的订单数据格式无效');
      }
      
      this.orders = orderList;
    
      // 获取路由参数中的新订单ID
      const params: RouterParams = router.getParams() as RouterParams;
      if (params?.newOrderId) {
        this.newOrderId = params.newOrderId;
        // 3秒后清除高亮效果
        setTimeout(() => {
          this.newOrderId = 0;
        }, 3000);
      }
    } catch {
      this.errorMessage = '加载订单失败';
      
      // 显示错误提示
      try {
        await promptAction.showToast({
          message: this.errorMessage,
          duration: 3000,
          bottom: 50
        });
      } catch {
        console.error('显示错误提示失败');
      }
    } finally {
      this.isLoading = false;
      this.isRefreshing = false;
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case '制作中':
        return '#FF6B6B';
      case '已完成':
        return '#67C23A';
      case '待取餐':
        return '#409EFF';
      case '已提交':
        return '#E6A23C';
      default:
        return '#909399';
    }
  }

  getStatusBackground(status: string): string {
    switch (status) {
      case '制作中':
        return '#FFF0F0';
      case '已完成':
        return '#F0F9EB';
      case '待取餐':
        return '#ECF5FF';
      case '已提交':
        return '#FDF6EC';
      default:
        return '#F4F4F5';
    }
  }

  @Builder
  OrderStatusTag(status: string): void {
    Text(status)
      .fontSize(12)
      .fontColor(this.getStatusColor(status))
      .backgroundColor(this.getStatusBackground(status))
      .padding({ left: 8, right: 8, top: 4, bottom: 4 })
      .borderRadius(4)
  }

  @Builder
  OrderCard(order: Order): void {
    Column() {
      Row() {
        Text(`订单号：${order.order_id}`)
          .fontSize(14)
          .fontColor('#666666')
        this.OrderStatusTag(order.status)
      }
      .width('100%')
      .justifyContent(FlexAlign.SpaceBetween)
      .margin({ bottom: 12 })

      Column() {
        if (Array.isArray(order.items) && order.items.length > 0) {
          ForEach(order.items, (item: OrderItem) => {
            Row() {
              Text(item.name)
                .fontSize(14)
                .fontColor('#333333')
              Row() {
                Text(`x${item.quantity}`)
                  .fontSize(14)
                  .fontColor('#666666')
                  .margin({ right: 8 })
                Text(`¥${item.subtotal.toFixed(2)}`)
                  .fontSize(14)
                  .fontColor('#FF6B6B')
              }
            }
            .width('100%')
            .justifyContent(FlexAlign.SpaceBetween)
            .margin({ bottom: 8 })
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
        Text(`下单时间：${order.created_at}`)
          .fontSize(14)
          .fontColor('#666666')
      }
      .margin({ bottom: 8 })

      Row() {
        Text(`共${order.items?.reduce((sum: number, item: OrderItem) => sum + item.quantity, 0) || 0}件商品`)
          .fontSize(14)
          .fontColor('#666666')
        Text(`合计：¥${order.total_amount.toFixed(2)}`)
          .fontSize(14)
          .fontColor('#FF6B6B')
      }
      .width('100%')
      .justifyContent(FlexAlign.SpaceBetween)
    }
    .width('100%')
    .padding(16)
    .backgroundColor(this.newOrderId === order.order_id ? '#FFF9F2' : Color.White)
    .borderRadius(8)
    .margin({ bottom: 12 })
    .onClick(() => {
      router.pushUrl({
        url: 'pages/OrderDetailPage',
        params: {
          orderId: order.order_id
        }
      });
    })
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

      // 订单列表区域
      Refresh({ refreshing: $$this.isRefreshing }) {
        List() {
          if (this.isLoading && !this.isRefreshing) {
            ListItem() {
              Column() {
                LoadingProgress()
                  .color('#007DFF')
                  .width(32)
                  .height(32)
                Text('加载中...')
                  .fontSize(14)
                  .fontColor('#999999')
                  .margin({ top: 8 })
              }
              .width('100%')
              .height('100%')
              .justifyContent(FlexAlign.Center)
            }
          } else if (this.errorMessage) {
            ListItem() {
              Column() {
                Image($r('app.media.order'))
                  .width(120)
                  .height(120)
                  .fillColor('#CCCCCC')
                  .margin({ bottom: 16 })
                Text(this.errorMessage)
                  .fontSize(14)
                  .fontColor('#999999')
              }
              .width('100%')
              .height('100%')
              .justifyContent(FlexAlign.Center)
            }
          } else {
            ForEach(this.orders, (order: Order) => {
              ListItem() {
                this.OrderCard(order)
              }
            })
          }
        }
        .width('100%')
        .height('100%')
        .padding({ left: 16, right: 16 })
        .layoutWeight(1)
      }
      .onRefreshing(() => {
        this.isRefreshing = true;
        this.loadOrders();
      })
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#F5F5F5')
  }
} 