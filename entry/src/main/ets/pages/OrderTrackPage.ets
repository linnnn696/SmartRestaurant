import router from '@ohos.router';

@Entry
@Component
struct OrderTrackPage {
  build() {
    Column() {
      Text('订单追踪').fontSize(24).margin({ top: 20, bottom: 20 })
      Text('订单状态：制作中（占位）').fontSize(18)
      Button('返回').onClick(() => router.back())
    }.padding(20)
  }
} 