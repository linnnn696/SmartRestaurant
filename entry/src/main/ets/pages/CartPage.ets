import router from '@ohos.router';

@Entry
@Component
struct CartPage {
  build() {
    Column() {
      Text('购物车').fontSize(24).margin({ top: 20, bottom: 20 })
      Text('购物车菜品列表（占位）').fontSize(18)
      Button('去结算').onClick(() => router.pushUrl({ url: 'pages/PaymentPage' })).margin({ top: 30 })
      Button('返回').onClick(() => router.back())
    }.padding(20)
  }
} 