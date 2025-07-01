import router from '@ohos.router';

@Entry
@Component
struct DishDetailPage {
  build() {
    Column() {
      Text('菜品详情').fontSize(24).margin({ top: 20, bottom: 20 })
      Text('这里显示菜品详细信息').fontSize(18)
      Button('加入购物车').margin({ top: 30 })
      Button('返回').onClick(() => router.back())
    }.padding(20)
  }
} 