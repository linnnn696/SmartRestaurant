import router from '@ohos.router';
import promptAction from '@ohos.promptAction';
import { OrderService, Order, OrderItem, OrderStatus } from '../service/OrderService';
import { ReviewService, CreateReviewRequest, Review } from '../service/ReviewService';

interface RouteParams {
  orderId: string;
}

@Entry
@Component
struct OrderTrackPage {
  @State private isLoading: boolean = true;
  @State private isSubmitting: boolean = false;
  @State private tasteRating: number = 0;
  @State private serviceRating: number = 0;
  @State private environmentRating: number = 0;
  @State private comment: string = '';
  @State private hasReview: boolean = false;
  @State private errorMessage: string = '';
  @State private order: Order | null = null;
  @State private review: Review | null = null;
  private orderId: string = '';
  private isPageMounted: boolean = false;

  aboutToAppear() {
    this.isPageMounted = true;
    this.initializeData();
  }

  aboutToDisappear() {
    this.isPageMounted = false;
  }

  private async initializeData() {
    try {
      // 获取并验证路由参数
      const params = router.getParams() as Record<string, string>;
      console.info('[OrderTrackPage] 路由参数:', JSON.stringify(params));
      
      if (!params?.orderId) {
        this.handleError('订单参数错误');
        return;
      }

      this.orderId = params.orderId;
      await this.loadOrderData();
    } catch (error) {
      this.handleError('初始化失败');
    }
  }

  private async loadOrderData() {
    if (!this.isPageMounted) return;

    try {
      this.isLoading = true;
      this.errorMessage = '';
      
      // 获取订单详情
      const orderData = await OrderService.getOrderDetail(this.orderId);
      if (!this.isPageMounted) return;
      
      if (!orderData) {
        this.handleError('订单不存在');
        return;
      }

      // 检查订单状态
      if (orderData.status !== OrderStatus.COMPLETED) {
        this.handleError('只能查看已完成订单的详情');
        return;
      }

      this.order = orderData;

      // 获取评价信息
      const review = await ReviewService.getOrderReview(Number(this.orderId));
      if (!this.isPageMounted) return;

      if (review) {
        this.review = review;
        this.hasReview = true;
        this.tasteRating = review.taste_rating;
        this.serviceRating = review.service_rating;
        this.environmentRating = review.environment_rating;
        this.comment = review.comment;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('[OrderTrackPage] 加载数据失败:', errorMessage);
      
      if (errorMessage.includes('HTTP')) {
        this.errorMessage = '网络请求失败，请重试';
      } else {
        this.handleError('加载数据失败');
      }
    } finally {
      if (this.isPageMounted) {
        this.isLoading = false;
      }
    }
  }

  private handleError(message: string) {
    if (!this.isPageMounted) return;
    
    this.errorMessage = message;
    promptAction.showToast({ message });
    router.back();
  }

  private async submitReview() {
    if (!this.isPageMounted || this.isSubmitting || !this.order) return;
    
    if (this.tasteRating === 0 || this.serviceRating === 0 || this.environmentRating === 0) {
      promptAction.showToast({ message: '请完成所有评分项' });
      return;
    }

    try {
      this.isSubmitting = true;
      const reviewData: CreateReviewRequest = {
        order_id: Number(this.order.id),
        taste_rating: this.tasteRating,
        service_rating: this.serviceRating,
        environment_rating: this.environmentRating,
        overall_rating: ReviewService.calculateOverallRating(
          this.tasteRating,
          this.serviceRating,
          this.environmentRating
        ),
        comment: this.comment.trim()
      };

      const response = await ReviewService.createReview(reviewData);
      if (!this.isPageMounted) return;

      this.review = response;
      this.hasReview = true;
      promptAction.showToast({ message: '评价提交成功' });
    } catch (error) {
      if (!this.isPageMounted) return;
      console.error('[OrderTrackPage] 提交评价失败:', error);
      promptAction.showToast({ message: '提交评价失败，请重试' });
    } finally {
      if (this.isPageMounted) {
        this.isSubmitting = false;
      }
    }
  }

  @Builder
  private renderStars(rating: number, type: 'taste' | 'service' | 'environment') {
    Row() {
      ForEach([1, 2, 3, 4, 5], (star: number) => {
        Image($r('app.media.ic_star'))
          .width(24)
          .height(24)
          .fillColor(rating >= star ? '#FFD700' : '#CCCCCC')
          .margin({ right: 8 })
          .enabled(!this.hasReview)
          .onClick(() => {
            if (!this.hasReview) {
              switch (type) {
                case 'taste':
                  this.tasteRating = star;
                  break;
                case 'service':
                  this.serviceRating = star;
                  break;
                case 'environment':
                  this.environmentRating = star;
                  break;
              }
            }
          })
      })
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

        Text('订单详情')
          .fontSize(20)
          .fontWeight(FontWeight.Bold)
          .margin({ left: 16 })
      }
      .width('100%')
      .height(56)
      .padding({ left: 16, right: 16 })
      .backgroundColor(Color.White)

      if (this.isLoading) {
        Column() {
          LoadingProgress()
            .color('#007DFF')
            .width(30)
            .height(30)
          Text('加载中...')
            .fontSize(14)
            .fontColor('#999999')
            .margin({ top: 8 })
        }
        .width('100%')
        .layoutWeight(1)
        .justifyContent(FlexAlign.Center)
      } else if (this.errorMessage) {
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
            .onClick(() => this.loadOrderData())
            .margin({ top: 16 })
        }
        .width('100%')
        .layoutWeight(1)
        .justifyContent(FlexAlign.Center)
      } else if (this.order) {
        Scroll() {
          Column() {
            // 订单信息卡片
            Column() {
              Row() {
                Text(`订单号：${this.order.id}`)
                  .fontSize(14)
                  .fontColor('#666666')
                Text(this.order.createTime)
                  .fontSize(14)
                  .fontColor('#999999')
              }
              .width('100%')
              .justifyContent(FlexAlign.SpaceBetween)
              .margin({ bottom: 12 })

              // 订单状态
              Text(`订单状态：${this.order.status}`)
                .fontSize(16)
                .fontWeight(FontWeight.Medium)
                .margin({ bottom: 12 })

              // 订单商品列表
              Column() {
                ForEach(this.order.items, (item: OrderItem) => {
                  Row() {
                    Text(item.name)
                      .fontSize(14)
                      .layoutWeight(1)
                    Text(`x${item.quantity}`)
                      .fontSize(14)
                      .margin({ right: 8 })
                    Text(`¥${(item.price * item.quantity).toFixed(2)}`)
                      .fontSize(14)
                  }
                  .width('100%')
                  .margin({ bottom: 8 })
                })
              }
              .margin({ bottom: 12 })

              // 总价
              Row() {
                Text('总计')
                  .fontSize(14)
                  .fontColor('#666666')
                Text(`¥${this.order.totalAmount.toFixed(2)}`)
                  .fontSize(16)
                  .fontWeight(FontWeight.Bold)
              }
              .width('100%')
              .justifyContent(FlexAlign.End)
            }
            .padding(16)
            .backgroundColor(Color.White)
            .borderRadius(8)
            .margin({ bottom: 12 })

            // 评价区域
            Column() {
              Text(this.hasReview ? '我的评价' : '订单评价')
                .fontSize(16)
                .fontWeight(FontWeight.Medium)
                .margin({ bottom: 16 })
                .alignSelf(ItemAlign.Start)

              // 评分项
              Column() {
                Row() {
                  Text('口味').fontSize(14).width(60)
                  this.renderStars(this.tasteRating, 'taste')
                }.margin({ bottom: 12 })

                Row() {
                  Text('服务').fontSize(14).width(60)
                  this.renderStars(this.serviceRating, 'service')
                }.margin({ bottom: 12 })

                Row() {
                  Text('环境').fontSize(14).width(60)
                  this.renderStars(this.environmentRating, 'environment')
                }.margin({ bottom: 12 })
              }
              .margin({ bottom: 16 })

              if (!this.hasReview) {
                // 评价输入框
                TextArea({ 
                  placeholder: '请输入您的评价建议（可选）',
                  text: this.comment
                })
                .height(100)
                .backgroundColor('#F5F5F5')
                .margin({ bottom: 20 })
                .onChange((value: string) => {
                  this.comment = value;
                })

                // 提交按钮
                Button('提交评价')
                  .width('100%')
                  .height(44)
                  .backgroundColor('#007DFF')
                  .enabled(!this.isSubmitting)
                  .onClick(() => this.submitReview())
              } else if (this.comment) {
                Text(this.comment)
                  .fontSize(14)
                  .fontColor('#666666')
                  .margin({ top: 8 })
              }
            }
            .padding(16)
            .backgroundColor(Color.White)
            .borderRadius(8)
          }
          .padding(16)
        }
      }
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#F5F5F5')
  }
} 