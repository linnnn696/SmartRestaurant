import router from '@ohos.router';
import promptAction from '@ohos.promptAction';
import { OrderService, Order, OrderItem, OrderStatus } from '../service/OrderService';

@Entry
@Component
struct OrderDetailPage {
  @State order: Order | null = null;
  @State isLoading: boolean = true;
  @State errorMessage: string = '';
  private orderId: number = 0;

  aboutToAppear() {
    const params = router.getParams();
    this.orderId = params['orderId'] as number;
    this.loadOrderDetail();
  }

  async loadOrderDetail() {
    if (!this.orderId) {
      this.errorMessage = '订单ID无效';
      return;
    }

    try {
      this.isLoading = true;
      this.order = await OrderService.getOrderDetail(this.orderId);
    } catch (error) {
      console.error('加载订单详情失败:', error);
      this.errorMessage = error instanceof Error ? error.message : '加载订单详情失败';
      promptAction.showToast({
        message: this.errorMessage,
        duration: 3000
      });
    } finally {
      this.isLoading = false;
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case OrderStatus.PREPARING:
        return '#FF6B6B';
      case OrderStatus.COMPLETED:
        return '#67C23A';
      case OrderStatus.READY:
        return '#409EFF';
      case OrderStatus.SUBMITTED:
        return '#E6A23C';
      default:
        return '#909399';
    }
  }

  getStatusBackground(status: string): string {
    switch (status) {
      case OrderStatus.PREPARING:
        return '#FFF0F0';
      case OrderStatus.COMPLETED:
        return '#F0F9EB';
      case OrderStatus.READY:
        return '#ECF5FF';
      case OrderStatus.SUBMITTED:
        return '#FDF6EC';
      default:
        return '#F4F4F5';
    }
  }

  @Builder
  OrderStatusTag(status: string) {
    Text(status)
      .fontSize(12)
      .fontColor(this.getStatusColor(status))
      .backgroundColor(this.getStatusBackground(status))
      .padding({ left: 8, right: 8, top: 4, bottom: 4 })
      .borderRadius(4)
  }

  @Builder
  OrderItemRow(item: OrderItem) {
    Row() {
      Row() {
        Image(item.menuItem.image_url || '')
          .width(60)
          .height(60)
          .borderRadius(8)
          .margin({ right: 12 })
          .backgroundColor('#F5F5F5')
        
        Column() {
          Text(item.menuItem.name)
            .fontSize(16)
            .fontColor('#333333')
          Text(`¥${item.price.toFixed(2)}`)
            .fontSize(14)
            .fontColor('#999999')
            .margin({ top: 4 })
        }
        .alignItems(HorizontalAlign.Start)
      }

      Column() {
        Text(`x${item.quantity}`)
          .fontSize(14)
          .fontColor('#666666')
        Text(`¥${item.subtotal.toFixed(2)}`)
          .fontSize(14)
          .fontColor('#FF6B6B')
          .margin({ top: 4 })
      }
      .alignItems(HorizontalAlign.End)
    }
    .width('100%')
    .justifyContent(FlexAlign.SpaceBetween)
    .padding({ top: 12, bottom: 12 })
  }

  build() {
    Column() {
      // 顶部导航栏
      Row() {
        Image($r('app.media.ic_back'))
          .width(24)
          .height(24)
          .onClick(() => {
            router.back();
          })
        Text('订单详情')
          .fontSize(18)
          .fontWeight(FontWeight.Medium)
      }
      .width('100%')
      .height(56)
      .padding({ left: 16, right: 16 })
      .justifyContent(FlexAlign.Start)
      .alignItems(VerticalAlign.Center)
      .backgroundColor(Color.White)

      if (this.isLoading) {
        LoadingProgress()
          .color('#007DFF')
          .width(32)
          .height(32)
      } else if (!this.order) {
        Text(this.errorMessage || '订单不存在')
          .fontSize(16)
          .fontColor('#999999')
      } else {
        Scroll() {
          Column() {
            // 订单状态卡片
            Column() {
              Row() {
                Column() {
                  this.OrderStatusTag(this.order.status)
                  Text('订单号：' + this.order.order_id)
                    .fontSize(14)
                    .fontColor('#666666')
                    .margin({ top: 8 })
                }
                .alignItems(HorizontalAlign.Start)

                if (this.order.status === OrderStatus.SUBMITTED) {
                  Button('取消订单')
                    .fontSize(14)
                    .fontColor('#FF6B6B')
                    .backgroundColor('#FFF0F0')
                    .height(32)
                    .borderRadius(16)
                    .padding({ left: 16, right: 16 })
                }
              }
              .width('100%')
              .justifyContent(FlexAlign.SpaceBetween)
            }
            .width('100%')
            .padding(16)
            .backgroundColor(Color.White)
            .borderRadius(8)
            .margin({ top: 12 })

            // 订单商品列表
            Column() {
              Text('订单商品')
                .fontSize(16)
                .fontWeight(FontWeight.Medium)
                .margin({ bottom: 12 })

              ForEach(this.order.items, (item: OrderItem) => {
                this.OrderItemRow(item)
                Divider().color('#F5F5F5').margin({ left: -16, right: -16 })
              })

              // 订单总计
              Row() {
                Text('商品总计')
                  .fontSize(14)
                  .fontColor('#666666')
                Text(`¥${this.order.total_amount.toFixed(2)}`)
                  .fontSize(16)
                  .fontColor('#333333')
                  .fontWeight(FontWeight.Medium)
              }
              .width('100%')
              .justifyContent(FlexAlign.SpaceBetween)
              .margin({ top: 12 })
            }
            .width('100%')
            .padding(16)
            .backgroundColor(Color.White)
            .borderRadius(8)
            .margin({ top: 12 })

            // 订单信息
            Column() {
              Text('订单信息')
                .fontSize(16)
                .fontWeight(FontWeight.Medium)
                .margin({ bottom: 12 })

              Row() {
                Text('桌号')
                  .fontSize(14)
                  .fontColor('#666666')
                Text(this.order.table_id.toString())
                  .fontSize(14)
                  .fontColor('#333333')
              }
              .width('100%')
              .justifyContent(FlexAlign.SpaceBetween)
              .margin({ bottom: 8 })

              Row() {
                Text('下单时间')
                  .fontSize(14)
                  .fontColor('#666666')
                Text(this.order.created_at)
                  .fontSize(14)
                  .fontColor('#333333')
              }
              .width('100%')
              .justifyContent(FlexAlign.SpaceBetween)
              .margin({ bottom: 8 })

              if (this.order.updated_at !== this.order.created_at) {
                Row() {
                  Text('更新时间')
                    .fontSize(14)
                    .fontColor('#666666')
                  Text(this.order.updated_at)
                    .fontSize(14)
                    .fontColor('#333333')
                }
                .width('100%')
                .justifyContent(FlexAlign.SpaceBetween)
              }
            }
            .width('100%')
            .padding(16)
            .backgroundColor(Color.White)
            .borderRadius(8)
            .margin({ top: 12, bottom: 24 })
          }
          .padding({ left: 16, right: 16 })
        }
        .scrollBar(BarState.Off)
        .edgeEffect(EdgeEffect.Spring)
      }
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#F5F5F5')
  }
} 