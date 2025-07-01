import router from '@ohos.router';

@Entry
@Component
struct PaymentPage {
  build() {
    Column() {
      Text('支付').fontSize(24).margin({ top: 20, bottom: 20 })
      Text('选择支付方式（占位）').fontSize(18)
      Button('确认支付').margin({ top: 30 })
      Button('返回').onClick(() => router.back())
    }.padding(20)
  }
} 