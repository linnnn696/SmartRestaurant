import router from '@ohos.router';

@Entry
@Component
struct KitchenScreenPage {
  build() {
    Column() {
      Text('后厨大屏').fontSize(24).margin({ top: 20, bottom: 20 })
      Text('同步订单信息（占位）').fontSize(18)
      Button('返回').onClick(() => router.back())
    }.padding(20)
  }
} 