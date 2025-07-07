import router from '@ohos.router';
import promptAction from '@ohos.promptAction';
import vibrator from '@ohos.vibrator';
import { OrderService, Order, OrderItem, OrderStatus } from '../service/OrderService';
import { ReviewService, CreateReviewRequest } from '../service/ReviewService';

@Observed
class ReviewInfo {
  orderId: number;
  tasteRating: number;
  serviceRating: number;
  environmentRating: number;
  comment: string;

  constructor(orderId: number) {
    this.orderId = orderId;
    this.tasteRating = 0;
    this.serviceRating = 0;
    this.environmentRating = 0;
    this.comment = '';
  }
}

@Entry
@Component
struct ReviewPage {
  @State orders: Order[] = [];
  @State reviewsMap: Map<string, ReviewInfo> = new Map();
  @State isSubmitting: boolean = false;

  aboutToAppear() {
    console.info('[ReviewPage] 页面即将显示');
    this.refreshOrders();
  }

  onPageShow() {
    console.info('[ReviewPage] 页面显示');
    this.refreshOrders();
  }

  private async refreshOrders() {
    try {
      console.info('[ReviewPage] 开始获取订单列表');
      const allOrders = await OrderService.getAllOrders();
      console.info('[ReviewPage] 获取到所有订单:', JSON.stringify(allOrders));
      
      // 过滤已完成的订单
      this.orders = allOrders.filter(order => {
        console.info(`[ReviewPage] 检查订单状态 - orderId: ${order.id}, status: ${order.status}`);
        return order.status === OrderStatus.COMPLETED;
      });
      console.info('[ReviewPage] 过滤后的已完成订单:', JSON.stringify(this.orders));

      // 获取每个订单的评价状态
      for (const order of this.orders) {
        console.info(`[ReviewPage] 检查订单评价状态 - orderId: ${order.id}`);
        const review = await ReviewService.getOrderReview(Number(order.id));
        console.info(`[ReviewPage] 订单评价结果:`, JSON.stringify(review));
        if (review) {
          // 如果订单已经评价过，从列表中移除
          console.info(`[ReviewPage] 移除已评价订单 - orderId: ${order.id}`);
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
        Stack() {
          Image($r('app.media.ic_star'))
            .width(24)
            .height(24)
            .margin({ right: 12 })
            .objectFit(ImageFit.Contain)
            .opacity(this.getRating(orderId, type) >= star ? 1 : 0.3)
            .onClick(() => {
              console.info(`[ReviewPage] 点击星星 - orderId: ${orderId}, type: ${type}, star: ${star}`);
              this.updateRating(orderId, type, star);
              vibrator.vibrate(10);
            })
        }
      })
    }
    .width('100%')
    .height(32)
    .alignItems(VerticalAlign.Center)
  }

  private getReviewByOrderId(orderId: string): ReviewInfo {
    let review = this.reviewsMap.get(orderId);
    if (!review) {
      review = new ReviewInfo(Number(orderId));
      this.reviewsMap.set(orderId, review);
    }
    return review;
  }

  updateRating(orderId: string, type: 'taste' | 'service' | 'environment', rating: number) {
    console.info(`[ReviewPage] 更新评分 - orderId: ${orderId}, type: ${type}, rating: ${rating}`);
    const review = this.getReviewByOrderId(orderId);

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

    // 强制触发UI更新
    this.reviewsMap = new Map(this.reviewsMap);
  }

  getRating(orderId: string, type: 'taste' | 'service' | 'environment'): number {
    const review = this.getReviewByOrderId(orderId);
    switch (type) {
      case 'taste':
        return review.tasteRating;
      case 'service':
        return review.serviceRating;
      case 'environment':
        return review.environmentRating;
      default:
        return 0;
    }
  }

  @Builder RatingItem(title: string, orderId: string, type: 'taste' | 'service' | 'environment') {
    Row() {
      Text(title)
        .fontSize(16)
        .fontColor('#333333')
        .width(60)
      this.StarRating(orderId, type)
      Text(this.getRatingText(this.getRating(orderId, type)))
        .fontSize(14)
        .fontColor('#666666')
        .margin({ left: 8 })
    }
    .width('100%')
    .height(48)
    .alignItems(VerticalAlign.Center)
    .margin({ bottom: 16 })
  }

  private getRatingText(rating: number): string {
    switch (rating) {
      case 0:
        return '请评分';
      case 1:
        return '非常差';
      case 2:
        return '差';
      case 3:
        return '一般';
      case 4:
        return '好';
      case 5:
        return '非常好';
      default:
        return '请评分';
    }
  }

  private async submitReview(orderId: string) {
    if (this.isSubmitting) {
      return;
    }

    const review = this.getReviewByOrderId(orderId);

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
      vibrator.vibrate(50);
      router.back();
    } catch (error) {
      console.error('[ReviewPage] 提交评价失败:', error);
      promptAction.showToast({ message: '评价提交失败，请重试' });
    } finally {
      this.isSubmitting = false;
    }
  }

  build() {
    Column() {
      // 顶部导航栏
      Row() {
        Image($r('app.media.ic_back'))
          .width(24)
          .height(24)
          .margin({ right: 16 })
          .onClick(() => {
            router.back();
          })
        Text('餐后评价')
          .fontSize(20)
          .fontWeight(FontWeight.Medium)
      }
      .width('100%')
      .height(56)
      .padding({ left: 16, right: 16 })
      .alignItems(VerticalAlign.Center)

      List() {
        ForEach(this.orders, (order: Order) => {
          ListItem() {
            Column() {
              // 订单信息
              Row() {
                Text(`订单号：${order.id}`)
                  .fontSize(14)
                  .fontColor('#666666')
                Text(order.createTime || '')
                  .fontSize(14)
                  .fontColor('#999999')
              }
              .width('100%')
              .justifyContent(FlexAlign.SpaceBetween)
              .margin({ bottom: 12 })

              // 订单内容
              ForEach(order.items || [], (item: OrderItem) => {
                Row() {
                  Row() {
                    Text(item.name || '未知商品')
                      .fontSize(14)
                      .fontColor('#333333')
                    Text(` x${item.quantity || 0}`)
                      .fontSize(14)
                      .fontColor('#666666')
                  }
                  Text(`¥${Number(item.price || 0).toFixed(2)}`)
                    .fontSize(14)
                    .fontColor('#333333')
                }
                .width('100%')
                .justifyContent(FlexAlign.SpaceBetween)
                .margin({ bottom: 8 })
              })

              // 订单总价
              Row() {
                Text('订单总价')
                  .fontSize(14)
                  .fontColor('#666666')
                Text(`¥${order.items.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2)}`)
                  .fontSize(16)
                  .fontColor('#E4A331')
                  .fontWeight(FontWeight.Medium)
              }
              .width('100%')
              .justifyContent(FlexAlign.SpaceBetween)
              .margin({ top: 8, bottom: 8 })

              Divider()
                .color('#EEEEEE')
                .margin({ top: 16, bottom: 16 })

              // 评分区域
              Text('为本次用餐评分')
                .fontSize(16)
                .fontWeight(FontWeight.Medium)
                .margin({ bottom: 24 })

              // 评分项
              this.RatingItem('口味', order.id, 'taste')
              this.RatingItem('服务', order.id, 'service')
              this.RatingItem('环境', order.id, 'environment')

              // 评价内容
              TextArea({ placeholder: '请输入您的评价内容（选填）' })
                .width('100%')
                .height(120)
                .backgroundColor('#F5F5F5')
                .borderRadius(8)
                .fontSize(16)
                .padding(16)
                .margin({ bottom: 16 })
                .onChange((value: string) => {
                  const review = this.getReviewByOrderId(order.id);
                  review.comment = value;
                })

              // 提交按钮
              Button('提交评价')
                .width('100%')
                .height(48)
                .backgroundColor('#E4A331')
                .borderRadius(24)
                .fontSize(16)
                .fontColor('#FFFFFF')
                .enabled(!this.isSubmitting)
                .onClick(() => {
                  this.submitReview(order.id);
                })
            }
            .width('100%')
            .padding(16)
            .backgroundColor('#FFFFFF')
            .borderRadius(16)
            .margin({ bottom: 16 })
          }
        })
      }
      .width('100%')
      .layoutWeight(1)
      .padding(16)
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#F5F5F5')
  }
} 