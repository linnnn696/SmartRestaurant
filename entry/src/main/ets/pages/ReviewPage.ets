import router from '@ohos.router';
import promptAction from '@ohos.promptAction';
import { OrderModel, Order, OrderItem } from '../model/OrderModel';

interface ReviewInfo {
  orderId: string;
  tasteRating: number;
  serviceRating: number;
  environmentRating: number;
  comment: string;
}

@Entry
@Component
struct ReviewPage {
  @State orders: Order[] = [];
  @State reviews: Map<string, ReviewInfo> = new Map();
  private orderModel: OrderModel = OrderModel.getInstance();

  aboutToAppear() {
    this.refreshOrders();
  }

  onPageShow() {
    // 每次页面显示时刷新订单列表
    this.refreshOrders();
  }

  private refreshOrders() {
    // 获取已完成的订单
    this.orders = this.orderModel.getOrders().filter(order => order.status === 'completed');
  }

  @Builder StarRating(orderId: string, type: 'taste' | 'service' | 'environment') {
    Row() {
      ForEach([1, 2, 3, 4, 5], (star: number, index?: number) => {
        Image($r('app.media.profile')) // 这里应该替换成星星图标
          .width(24)
          .height(24)
          .fillColor(this.getRating(orderId, type) >= star ? '#FFD700' : '#CCCCCC')
          .margin({ right: 8 })
          .onClick(() => {
            this.updateRating(orderId, type, star);
          })
      })
    }
  }

  getRating(orderId: string, type: 'taste' | 'service' | 'environment'): number {
    const review: ReviewInfo | undefined = this.reviews.get(orderId);
    switch (type) {
      case 'taste':
        return review?.tasteRating || 0;
      case 'service':
        return review?.serviceRating || 0;
      case 'environment':
        return review?.environmentRating || 0;
    }
  }

  updateRating(orderId: string, type: 'taste' | 'service' | 'environment', rating: number) {
    const review: ReviewInfo = this.reviews.get(orderId) || {
      orderId,
      tasteRating: 0,
      serviceRating: 0,
      environmentRating: 0,
      comment: ''
    };

    switch (type) {
      case 'taste':
        review.tasteRating = rating;
        break;
      case 'service':
        review.serviceRating = rating;
        break;
      case 'environment':
        review.environmentRating = rating;
        break;
    }

    this.reviews.set(orderId, review);
  }

  @Builder RatingItem(title: string, orderId: string, type: 'taste' | 'service' | 'environment') {
    Row() {
      Text(title)
        .fontSize(14)
        .fontColor('#666666')
        .width(60)
      this.StarRating(orderId, type)
    }
    .width('100%')
    .justifyContent(FlexAlign.Start)
    .margin({ bottom: 12 })
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

        Text('餐后评价')
          .fontSize(20)
          .fontWeight(FontWeight.Bold)
          .margin({ left: 16 })
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
          Text('暂无可评价的订单')
            .fontSize(16)
            .fontColor('#999999')
        }
        .width('100%')
        .layoutWeight(1)
        .justifyContent(FlexAlign.Center)
      } else {
        List() {
          ForEach(this.orders, (order: Order, index?: number) => {
            ListItem() {
              Column() {
                // 订单信息
                Row() {
                  Text(`订单号：${order.id}`)
                    .fontSize(14)
                    .fontColor('#666666')
                  Text(order.createTime)
                    .fontSize(14)
                    .fontColor('#999999')
                }
                .width('100%')
                .justifyContent(FlexAlign.SpaceBetween)
                .margin({ bottom: 12 })

                // 订单内容
                Column() {
                  ForEach(order.items, (item: OrderItem, index?: number) => {
                    Text(`${item.name} x${item.quantity}`)
                      .fontSize(14)
                      .margin({ bottom: 4 })
                  })
                }
                .alignItems(HorizontalAlign.Start)
                .margin({ bottom: 12 })

                Divider().color('#EEEEEE')

                // 评分区域
                Column() {
                  Text('为本次用餐评分')
                    .fontSize(16)
                    .fontWeight(FontWeight.Medium)
                    .margin({ top: 12, bottom: 16 })
                    .alignSelf(ItemAlign.Start)

                  this.RatingItem('口味', order.id, 'taste')
                  this.RatingItem('服务', order.id, 'service')
                  this.RatingItem('环境', order.id, 'environment')
                }
                .margin({ bottom: 16 })
                .alignItems(HorizontalAlign.Start)

                // 评价输入
                TextArea({ 
                  placeholder: '请输入您的评价建议（可选）',
                  text: this.reviews.get(order.id)?.comment || ''
                })
                  .width('100%')
                  .height(100)
                  .backgroundColor('#F5F5F5')
                  .margin({ bottom: 16 })
                  .onChange((value: string) => {
                    const review: ReviewInfo = this.reviews.get(order.id) || {
                      orderId: order.id,
                      tasteRating: 0,
                      serviceRating: 0,
                      environmentRating: 0,
                      comment: ''
                    };
                    review.comment = value;
                    this.reviews.set(order.id, review);
                  })

                // 提交按钮
                Button('提交评价')
                  .width('100%')
                  .height(40)
                  .backgroundColor('#FF4081')
                  .onClick(() => {
                    const review: ReviewInfo | undefined = this.reviews.get(order.id);
                    if (!review || 
                        review.tasteRating === 0 || 
                        review.serviceRating === 0 || 
                        review.environmentRating === 0) {
                      promptAction.showToast({ message: '请完成所有评分项' });
                      return;
                    }
                    // TODO: 保存评价信息
                    promptAction.showToast({ message: '评价提交成功' });
                    router.back();
                  })
              }
              .width('100%')
              .padding(16)
              .backgroundColor(Color.White)
              .borderRadius(12)
            }
            .margin({ bottom: 12 })
          })
        }
        .layoutWeight(1)
        .margin({ top: 12 })
        .padding({ left: 16, right: 16 })
      }
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#F5F5F5')
  }
} 