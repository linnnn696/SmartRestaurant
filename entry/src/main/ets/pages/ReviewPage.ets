import router from '@ohos.router';
import promptAction from '@ohos.promptAction';
import { OrderService, Order, OrderItem, OrderStatus } from '../service/OrderService';
import { ReviewService, CreateReviewRequest } from '../service/ReviewService';

interface ReviewInfo {
  orderId: number;
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
  @State isSubmitting: boolean = false;

  aboutToAppear() {
    this.refreshOrders();
  }

  onPageShow() {
    this.refreshOrders();
  }

  private async refreshOrders() {
    try {
      console.info('[ReviewPage] 开始获取订单列表');
      const allOrders = await OrderService.getAllOrders();
      console.info('[ReviewPage] 获取到所有订单:', JSON.stringify(allOrders));
      
      // 过滤已完成的订单
      this.orders = allOrders.filter(order => order.status === OrderStatus.COMPLETED);
      console.info('[ReviewPage] 过滤后的已完成订单:', JSON.stringify(this.orders));

      // 获取每个订单的评价状态
      for (const order of this.orders) {
        const review = await ReviewService.getOrderReview(Number(order.id));
        if (review) {
          // 如果订单已经评价过，从列表中移除
          this.orders = this.orders.filter(o => o.id !== order.id);
        }
      }
      console.info('[ReviewPage] 最终可评价订单列表:', JSON.stringify(this.orders));
    } catch (error) {
      console.error('[ReviewPage] 获取订单列表失败:', error);
      promptAction.showToast({ message: '获取订单列表失败' });
    }
  }

  @Builder StarRating(orderId: string, type: 'taste' | 'service' | 'environment') {
    Row() {
      ForEach([1, 2, 3, 4, 5], (star: number) => {
        Image($r('app.media.ic_star'))
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
      orderId: Number(orderId),
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

  private async submitReview(orderId: string) {
    if (this.isSubmitting) {
      return;
    }

    const review = this.reviews.get(orderId);
    if (!review) {
      promptAction.showToast({ message: '评价数据不完整' });
      return;
    }

    if (review.tasteRating === 0 || review.serviceRating === 0 || review.environmentRating === 0) {
      promptAction.showToast({ message: '请完成所有评分项' });
      return;
    }

    try {
      this.isSubmitting = true;

      const reviewData: CreateReviewRequest = {
        order_id: review.orderId,
        taste_rating: review.tasteRating,
        service_rating: review.serviceRating,
        environment_rating: review.environmentRating,
        overall_rating: ReviewService.calculateOverallRating(
          review.tasteRating,
          review.serviceRating,
          review.environmentRating
        ),
        comment: review.comment
      };

      await ReviewService.createReview(reviewData);
      promptAction.showToast({ message: '评价提交成功' });
      
      // 刷新订单列表
      await this.refreshOrders();

      // 如果没有更多可评价的订单，返回上一页
      if (this.orders.length === 0) {
        router.back();
      }
    } catch (error) {
      console.error('提交评价失败:', error);
      promptAction.showToast({ message: '提交评价失败，请重试' });
    } finally {
      this.isSubmitting = false;
    }
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
          ForEach(this.orders, (order: Order) => {
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
                  ForEach(order.items, (item: OrderItem) => {
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

                  TextArea({ placeholder: '请输入评价内容（可选）' })
                    .height(100)
                    .backgroundColor('#F5F5F5')
                    .margin({ bottom: 16 })
                    .onChange((value: string) => {
                      const review = this.reviews.get(order.id) || {
                        orderId: Number(order.id),
                        tasteRating: 0,
                        serviceRating: 0,
                        environmentRating: 0,
                        comment: ''
                      };
                      review.comment = value;
                      this.reviews.set(order.id, review);
                    })

                  Button('提交评价')
                    .width('100%')
                    .height(44)
                    .backgroundColor('#007AFF')
                    .onClick(() => this.submitReview(order.id))
                }
                .padding(16)
                .backgroundColor(Color.White)
                .borderRadius(8)
              }
              .width('100%')
              .padding(16)
              .backgroundColor(Color.White)
              .borderRadius(8)
              .margin({ bottom: 12 })
              .onClick(() => {
                router.pushUrl({
                  url: 'pages/OrderTrackPage',
                  params: { orderId: order.id }
                });
              })
            }
          })
        }
        .width('100%')
        .layoutWeight(1)
        .padding(16)
      }
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#F5F5F5')
  }
} 