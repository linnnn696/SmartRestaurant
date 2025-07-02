import router from '@ohos.router';
import { DishItem, CartModel, SAMPLE_DISHES } from '../model/DishModel';

interface RouteParams {
  dishId: number;
}

@Entry
@Component
struct DishDetailPage {
  @State dish: DishItem | undefined = undefined;
  private cartModel: CartModel = CartModel.getInstance();

  aboutToAppear() {
    try {
      const params = router.getParams() as RouteParams;
      if (params?.dishId) {
        this.dish = SAMPLE_DISHES.find(d => d.id === params.dishId);
      }
    } catch (error) {
      console.error('Failed to get router params:', error);
    }
  }

  build() {
    Column() {
      // Header with back button
      Row() {
        Image($r('app.media.ic_back'))
          .width(24)
          .height(24)
          .onClick(() => router.back())
        Text('菜品详情')
          .fontSize(20)
          .fontWeight(FontWeight.Bold)
          .margin({ left: 16 })
      }
      .width('100%')
      .height(56)
      .padding({ left: 16, right: 16 })
      .backgroundColor(Color.White)

      if (this.dish) {
        // Dish image
        if (typeof this.dish.image === 'string') {
          // 使用纯色背景
          Row()
            .width('100%')
            .height(240)
            .backgroundColor(this.dish.image)
        } else {
          Image(this.dish.image)
            .width('100%')
            .height(240)
            .objectFit(ImageFit.Cover)
        }

        // Dish info
        Column() {
          Text(this.dish.name)
            .fontSize(24)
            .fontWeight(FontWeight.Bold)
            .margin({ top: 20, bottom: 8 })

          Text(this.dish.description)
            .fontSize(16)
            .fontColor('#666666')
            .margin({ bottom: 12 })

          if (this.dish.sales) {
            Text('月售 ' + this.dish.sales)
              .fontSize(14)
              .fontColor('#999999')
              .margin({ bottom: 12 })
          }

          Text('¥' + this.dish.price.toFixed(2))
            .fontSize(24)
            .fontColor('#F36D6F')
            .fontWeight(FontWeight.Bold)
        }
        .width('100%')
        .padding(20)
        .backgroundColor(Color.White)

        // Add to cart button
        Button('加入购物车')
          .width('90%')
          .height(48)
          .fontSize(18)
          .backgroundColor('#F36D6F')
          .margin({ top: 20 })
          .onClick(() => {
            if (this.dish) {
              this.cartModel.addToCart(this.dish.id);
              router.back();
            }
          })
      } else {
        // Error state
        Text('菜品不存在')
          .fontSize(16)
          .fontColor('#999999')
          .margin({ top: 40 })
      }
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#F5F5F5')
  }
} 