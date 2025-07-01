import router from '@ohos.router';

@Entry
@Component
struct MapPage {
  build() {
    Column() {
      Text('餐厅地图').fontSize(24).margin({ top: 20, bottom: 20 })
      Text('这里集成鸿蒙地图服务（占位）').fontSize(18)
      Button('返回').onClick(() => router.back())
    }.padding(20)
  }
} 