@Component
export struct OrderListPage {
  build() {
    Column() {
      // 顶部导航栏
      Row() {
        Text('我的订单')
          .fontSize(20)
          .fontWeight(FontWeight.Bold)
      }
      .width('100%')
      .padding(15)
      .backgroundColor('#FFFFFF')

      // 订单列表
      List() {
        ListItem() {
          Column() {
            Row() {
              Text('订单号：123456')
                .fontSize(16)
                .fontWeight(FontWeight.Medium)
              Blank()
              Text('进行中')
                .fontSize(14)
                .fontColor('#FF6B6B')
            }
            .width('100%')
            .padding({ top: 12, bottom: 8 })

            Row() {
              Text('宫保鸡丁 x1')
                .fontSize(14)
                .fontColor('#666666')
              Text('水煮鱼片 x1')
                .fontSize(14)
                .fontColor('#666666')
                .margin({ left: 8 })
            }
            .width('100%')
            .padding({ bottom: 8 })

            Row() {
              Text('2024-03-19 12:30')
                .fontSize(12)
                .fontColor('#999999')
              Blank()
              Text('￥96.00')
                .fontSize(16)
                .fontColor('#333333')
            }
            .width('100%')
            .padding({ bottom: 12 })
          }
          .width('100%')
          .padding({ left: 15, right: 15 })
          .backgroundColor(Color.White)
        }
        .margin({ bottom: 8 })
      }
      .width('100%')
      .layoutWeight(1)
      .backgroundColor('#F5F5F5')
    }
    .width('100%')
    .height('100%')
  }
} 