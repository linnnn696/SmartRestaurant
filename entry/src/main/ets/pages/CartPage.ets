import { CartItem, CartModel, DishItem, SAMPLE_DISHES } from '../model/DishModel'
import router from '@ohos.router'
import promptAction from '@ohos.promptAction'

@Entry
@Component
struct CartPage {
  @State cartItems: CartItem[] = []
  @State totalAmount: number = 0
  @State animatingItems: Set<number> = new Set()
  private cartModel: CartModel = CartModel.getInstance()

  aboutToAppear() {
    this.updateCart()
  }

  updateCart() {
    this.cartItems = this.cartModel.getItems()
    this.totalAmount = this.cartModel.getTotalAmount()
  }

  getDish(dishId: number): DishItem | undefined {
    return SAMPLE_DISHES.find(dish => dish.id === dishId)
  }

  @Builder
  QuantityControl(item: CartItem) {
    Row() {
      // 减号按钮
      Button({ type: ButtonType.Circle }) {
        Image($r('app.media.ic_remove'))
          .width(20)
          .height(20)
          .fillColor('#FF4081')
      }
      .width(28)
      .height(28)
      .backgroundColor('#FFF0F4')
      .scale(this.animatingItems.has(item.dishId) ? { x: 0.8, y: 0.8 } : { x: 1, y: 1 })
      .onClick(() => {
        this.cartModel.removeFromCart(item.dishId)
        this.animatingItems.add(item.dishId)
        animateTo({ duration: 300, curve: Curve.Smooth }, () => {
          this.animatingItems.delete(item.dishId)
        })
        this.updateCart()
      })

      // 数量显示
      Text(item.quantity.toString())
        .fontSize(16)
        .margin({ left: 16, right: 16 })

      // 加号按钮
      Button({ type: ButtonType.Circle }) {
        Image($r('app.media.ic_add'))
          .width(20)
          .height(20)
          .fillColor(Color.White)
      }
      .width(28)
      .height(28)
      .backgroundColor('#FF4081')
      .scale(this.animatingItems.has(-item.dishId) ? { x: 0.8, y: 0.8 } : { x: 1, y: 1 })
      .onClick(() => {
        this.cartModel.addToCart(item.dishId)
        this.animatingItems.add(-item.dishId)
        animateTo({ duration: 300, curve: Curve.Smooth }, () => {
          this.animatingItems.delete(-item.dishId)
        })
        this.updateCart()
      })
    }
  }

  build() {
    Column() {
      // 顶部标题栏
      Row() {
        Button() {
          Image($r('app.media.ic_back'))
            .width(24)
            .height(24)
        }
        .backgroundColor('transparent')
        .onClick(() => router.back())

        Text('购物车')
          .fontSize(20)
          .fontWeight(FontWeight.Bold)
          .margin({ left: 16 })
      }
      .width('100%')
      .height(56)
      .padding({ left: 16, right: 16 })
      .backgroundColor(Color.White)

      if (this.cartItems.length === 0) {
        Column() {
          Image($r('app.media.ic_cart'))
            .width(120)
            .height(120)
            .fillColor('#cccccc')
            .margin({ bottom: 16 })
          Text('购物车是空的')
            .fontSize(16)
            .fontColor('#999999')
          Button('去点餐')
            .margin({ top: 24 })
            .backgroundColor('#ff4081')
            .onClick(() => router.back())
        }
        .width('100%')
        .layoutWeight(1)
        .justifyContent(FlexAlign.Center)
      } else {
        // 购物车列表
        List() {
          ForEach(this.cartItems, (item: CartItem) => {
            ListItem() {
              Row() {
                Image(this.getDish(item.dishId)?.image || '')
                  .width(80)
                  .height(80)
                  .borderRadius(8)
                  .margin({ right: 12 })
                  .objectFit(ImageFit.Cover)

                Column() {
                  Text(this.getDish(item.dishId)?.name || '')
                    .fontSize(16)
                    .fontWeight(FontWeight.Medium)
                  if (this.getDish(item.dishId)?.tag) {
                    Text(this.getDish(item.dishId)?.tag)
                      .fontSize(12)
                      .backgroundColor('#fff0f4')
                      .fontColor('#ff4081')
                      .padding({ left: 6, right: 6, top: 2, bottom: 2 })
                      .borderRadius(4)
                      .margin({ top: 4 })
                  }
                  Text('¥' + (this.getDish(item.dishId)?.price || 0).toFixed(2))
                    .fontSize(16)
                    .fontWeight(FontWeight.Bold)
                    .fontColor('#ff4081')
                    .margin({ top: 4 })
                }
                .alignItems(HorizontalAlign.Start)
                .layoutWeight(1)

                // 使用数量控制组件
                this.QuantityControl(item)
              }
              .width('100%')
              .padding(16)
              .backgroundColor(Color.White)
              .borderRadius(12)
              .margin({ bottom: 1 })
            }
          })
        }
        .layoutWeight(1)
        .margin({ top: 8 })
      }

      // 底部结算栏
      Row() {
        Column() {
          Text('合计')
            .fontSize(14)
            .fontColor('#666666')
          Text('¥' + this.totalAmount.toFixed(2))
            .fontSize(20)
            .fontColor('#ff4081')
            .fontWeight(FontWeight.Bold)
        }
        .alignItems(HorizontalAlign.Start)
        .layoutWeight(1)

        Button('去结算')
          .width(120)
          .height(40)
          .backgroundColor('#ff4081')
          .onClick(() => {
            if (this.cartItems.length > 0) {
              router.pushUrl({
                url: 'pages/PaymentPage',
                params: {
                  amount: this.totalAmount
                }
              })
            } else {
              promptAction.showToast({ message: '请先选择商品' })
            }
          })
      }
      .width('100%')
      .height(80)
      .padding({ left: 16, right: 16 })
      .backgroundColor(Color.White)
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#f5f5f5')
  }
} 