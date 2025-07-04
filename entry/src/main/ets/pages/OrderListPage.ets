import router from '@ohos.router';
import promptAction from '@ohos.promptAction';
import { OrderService, OrderItem, Order, OrderStatus } from '../service/OrderService';

interface RouterParams {
  newOrderId?: string;
}

@Component
export struct OrderListPage {
  @State orders: Order[] = [];
  @State currentIndex: number = 1;  // 当前选中的是订单页面
  @State isLoading: boolean = false;
  @State newOrderId: string = '';
  @State errorMessage: string = '';
  private loadOrdersTimer: number | null = null;

  aboutToAppear() {
    // 首次加载订单
    this.loadOrders();
  }

  aboutToDisappear() {
    // 清理定时器
    if (this.loadOrdersTimer !== null) {
      clearTimeout(this.loadOrdersTimer);
      this.loadOrdersTimer = null;
    }
  }

  onPageShow() {
    // 页面显示时，如果不是首次加载，延迟刷新订单列表
    if (this.orders.length > 0) {
      this.loadOrdersTimer = setTimeout(() => {
        this.loadOrders();
      }, 500) as number;
    }
  }

  async loadOrders() {
    console.info('[OrderListPage] 开始加载订单');

    try {
      console.info('[OrderListPage] 设置加载状态');
      this.isLoading = true;
      this.errorMessage = '';
      
      console.info('[OrderListPage] 调用后端API获取订单列表');
      const orderList = await OrderService.getAllOrders();
      console.info('[OrderListPage] 获取到订单列表:', JSON.stringify(orderList));
      
      // 检查返回数据的有效性
      if (!Array.isArray(orderList)) {
        console.error('[OrderListPage] 订单数据格式无效');
        throw new Error('返回的订单数据格式无效');
      }
      
      console.info('[OrderListPage] 更新订单列表数据');
      this.orders = orderList;
      console.info('[OrderListPage] 订单列表更新完成，数量:', orderList.length);
    
      // 获取路由参数中的新订单ID
      const params: RouterParams = router.getParams() as RouterParams;
      if (params?.newOrderId) {
        console.info('[OrderListPage] 发现新订单ID:', params.newOrderId);
        this.newOrderId = params.newOrderId;
        // 3秒后清除高亮效果
        const timer: number = setTimeout(() => {
          this.newOrderId = '';
        }, 3000) as number;
      }
    } catch (error) {
      console.error('[OrderListPage] 加载订单失败:', error);
      this.errorMessage = error instanceof Error ? error.message : '加载订单失败';
      
      // 显示错误提示
      try {
        await promptAction.showToast({
          message: this.errorMessage,
          duration: 3000,
          bottom: 50
        });
      } catch (toastError) {
        console.error('[OrderListPage] 显示错误提示失败:', toastError);
      }
    } finally {
      console.info('[OrderListPage] 完成加载，重置加载状态');
      this.isLoading = false;
      
      // 强制页面重新渲染
      console.info('[OrderListPage] 触发页面重新渲染');
      this.forceUpdate();
    }
  }

  // 强制更新页面的方法
  private forceUpdate() {
    // 创建一个临时数组来保存当前订单
    const tempOrders = [...this.orders];
    // 清空订单列表
    this.orders = [];
    // 在下一个事件循环中恢复订单列表，触发重新渲染
    setTimeout(() => {
      this.orders = tempOrders;
    }, 0);
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
        else if (this.errorMessage) {
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
        console.info('[OrderListPage] 刷新状态改变:', refreshStatus);
        if (refreshStatus === RefreshStatus.Refresh) {
          console.info('[OrderListPage] 触发下拉刷新，调用loadOrders');
          this.loadOrders()
        }
      })
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#F5F5F5')
  }

  @Builder
  OrderStatusTag(status: OrderStatus) {
    Text(status === OrderStatus.SUBMITTED ? '已提交' :
         status === OrderStatus.PREPARING ? '制作中' :
         status === OrderStatus.COMPLETED ? '已完成' : '已提交')
      .fontSize(12)
      .fontColor(status === OrderStatus.PREPARING ? '#FF6B6B' :
                 status === OrderStatus.COMPLETED ? '#52C41A' : '#FF9500')
      .backgroundColor(status === OrderStatus.PREPARING ? '#FFF0F0' :
                      status === OrderStatus.COMPLETED ? '#F0F9EB' : '#FDF6EC')
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

  getStatusText(status: OrderStatus): string {
    switch (status) {
      case OrderStatus.SUBMITTED:
        return '已提交';
      case OrderStatus.PREPARING:
        return '制作中';
      case OrderStatus.COMPLETED:
        return '已完成';
      default:
        return '已提交';
    }
  }

  getStatusColor(status: OrderStatus): string {
    switch (status) {
      case OrderStatus.SUBMITTED:
        return '#FF9500';  // 橙色
      case OrderStatus.PREPARING:
        return '#FF6B6B';  // 红色
      case OrderStatus.COMPLETED:
        return '#52C41A';  // 绿色
      default:
        return '#FF9500';  // 默认使用已提交的颜色
    }
  }
} 